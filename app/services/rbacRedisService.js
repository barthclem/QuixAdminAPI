/**
 * Created by barthclem on 5/24/17.
 */
'use strict';

let Redis = require('ioredis');
let redis = new Redis();
let redisTree = require('ioredis-tree');
redisTree(redis);
const tree = 'Quix_Tree';
const quixRoot = 'q';
let event = require('../models/event');

module.exports = {

    /**
     * @description this function initializes the quiz tree and creates a new one if none exists
     */
    initialize:   function intialize() {
        //check if a relationship already exist
        redis.texists(tree, 'root').then(result => {
            if (result === 0) {
                redis.tinsert(tree, 'root', quixRoot);
                this.loadData();
            }
        }).catch(error => {
                console.log(` Redis Error => ${error}`);
            });
    },

    /**
     * @description this checks if a categoryEntry belongs to a category
     * @param {integer} catId - this is ID of the category
     * @param {integer} catEntId - this is the ID of the categoryEntry
     * @return {boolean}
     */
    catEntBelongsToCat: function (catId, catEntId) {
        let category = `C${catId}`;
        let categoryEntry = `CE${catEntId}`;
        redis.tparents(tree, categoryEntry)
            .then(parent => {
                return parent === category;
            });
    },

    /**
     * @description this checks if a category belongs to an event
     * @param {integer} eventId - this is ID of the event
     * @param {integer} categoryId - this is the ID of the category
     * @return {boolean}
     */
    categoryBelongsToEvent: function (eventId, categoryId) {
        let event = `E${eventId}`;
        let category = `C${categoryId}`;
        return redis.tparents(tree, category)
            .then(parent => {
                return parent[0] === event;
            });
    },

    /**
     * @description this checks if a categoryEntry belongs to an Event
     * @param {integer} evtId - this is the ID of the event
     * @param {integer} catEntId - this is the ID of the categoryEntry
     * @return {boolean}
     */
    catEntBelongsToEvent: function (evtId, catEntId) {
        let event = `E${evtId}`;
        let categoryEntry = `CE${catEntId}`;

        return redis.tparents(tree, categoryEntry)
            .then(parent => {
                return redis.tparents(tree, parent)
                    .then(grandParent => {
                        return grandParent[0] === event;
                    });
            })
            .catch(error => {
                console.log(`CategoryEntry to Event Error => ${error}`);
            });
    },

    /**
     * @description this function creates a new event node in the tree
     * @param {integer} evtId - the ID of the new event to be added to the tree
     */
    createNewEvent: function (evtId) {
        let event = `E${evtId}`;
        redis.tinsert(tree, quixRoot, event);
    },

    /**
     * @description this function creates a new category to be attached to an event node
     * @param {integer} evtId - the ID of the event parent node
     * @param {integer} catId - the ID of the category child node
     */
    createNewCategory: function (evtId, catId) {
        let event = `E${evtId}`;
        let category = `C${catId}`;
        redis.tinsert(tree, event, category);
    },

    /**
     * @description this function creates a new categoryEntry to be attached to a category node
     * @param {integer} catId - the ID of the category parent node
     * @param {integer} catEntId - the ID of the category child node
     */
    createNewCategoryEntry: function (catId, catEntId) {
        let category = `C${catId}`;
        let categoryEntry = `CE${catEntId}`;
        redis.tinsert(tree, category, categoryEntry);
    },

    /**
     * @description this function removes a child categoryEntry from the tree
     * @param {integer} catEntId - the ID of the categoryEntry
     */
    removeCategoryEntry: function (catEntId) {
        let categoryEntry = `CE${catEntId}`;
        redis.tmrem(tree, categoryEntry);
    },

    /**
     * @description this function removes category node with its all its categoryEntry nodes
     * @param {integer} catId - the ID of the category
     */
    removeCategory: function (catId) {
        let category = `C${catId}`;
        redis.tdestroy(tree, category);
    },

    /**
     * @description this function removes event node with its all children nodes
     * @param {integer} evtId - the ID of the event
     */
    removeEvent: function (evtId) {
        let event = `E${evtId}`;
        redis.tdestroy(tree, event);
    },

    /**
     * @description this function forms a tree structure model of existing data in the database
     */
    loadData: function () {
        event.forge().fetchAll()
            .then(eventsData => {
                eventsData.each(eachEvent => {
                    let eventId = eachEvent.id;
                    eachEvent.load('category')
                        .then(eventData => {
                            eventData.related('category').fetch({ withRelated: ['categoryEntry'] }).then(category => {
                                this.createNewEvent(eventId);
                                category.each(categoryEntry => {
                                    let categoryId = categoryEntry.id;
                                    this.createNewCategory(eventId, categoryId);
                                    categoryEntry.related('categoryEntry').each(
                                        entry => {
                                            let catEntryid = entry.id;
                                            this.createNewCategoryEntry(categoryId, catEntryid);
                                        }
                                    );

                                });
                            });
                        });
                });

            })
            .catch(error => {
                console.log(`Error => ${error}`);
            });
    }
};
