'use strict';
/**
 *@description this is class handles all action that can be performed on a Event Category
 */
class CategoryService {

    /**
     *
     *@description category Service constructor
     *
     *@param  {object} category - category model instance
     *@param {object}  event - event model instance
     *@param {object}  rbacService - rbac service instance
     */
    constructor (category, event, rbacService) {
        this.category = category;
        this.event = event;
        this.rbacService = rbacService;
    }

    /**
     *
     *@description create a category of event
     *
     *@param  {object} categoryData - Object containing category data
     *
     * @return {object} a newly created category object
     */
    createCategory (categoryData) {
        return new Promise((resolve, reject)=>{
            this.category.forge().save(categoryData)
                .then( data => {
                    this.rbacService.createNewCategory(categoryData.event_id, data.id);
                    return resolve(data);
                })
                .catch(error => {
                    reject (error);
                });
        });
    }

    /**
     *
     *@description Edit a category
     *
     * @param {integer}  categoryId - Integer identifying a category
     * @param  {object} categoryData - Object containing new category data
     *
     * @return {object} object - A modified category Object / error
     */
    editCategory (categoryId, categoryData) {
        return new Promise((resolve, reject)=>{
		console.log(`Edit Category => ${JSON.stringify(categoryData)}`);
            this.category.forge({id : categoryId}).save(categoryData)
                .then(data => {
                    console.log(` Edit category Service Data => ${JSON.stringify(data)}`);
                    return resolve(data);
                })
                .catch(error => {
                    reject (error);
                });
        });
    }

    /**
     *
     *@description Get  a category { including categoryEntries }
     *
     * @param {Integer}  categoryId - Integer identifying a category
     *
     * @return {object} object -  category Object / error
     */
    getCategory (categoryId) {
        return new Promise((resolve, reject)=>{
            this.category.forge({id : categoryId}).fetch({
                withRelated : ['categoryEntry']
            })
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    reject (error);
                });
        });
    }

    /**
     *
     *@description Get  all categories
     *
     * @return {object} object -  Object containing all categories / error
     */
    getAllCategories () {
        return new Promise((resolve, reject)=>{
            this.category.forge().fetchAll()
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    reject (error);
                });
        });
    }


    /**
     *
     *@description Delete a Category
     *
     *@param  {integer} categoryId - the ID of a category
     *
     * @return {object} object - a object containing message/error
     */
    deleteCategory (categoryId) {
        return new Promise((resolve, reject)=>{
            this.category.forge({id : categoryId})
                .destroy()
                .then(data => {
                    this.rbacService.removeCategory(categoryId);
                    return {message : "category deleted successfully"};
                })
                .catch(error => {
                    reject (error);
                });
        });
    }



}

module.exports = CategoryService;
