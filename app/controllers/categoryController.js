/**
 * Created by barthclem on 4/25/17.
 */
'use strict';

class CategoryController {

    /**
     *
     *@description Category Controller
     *
     *@param  {object} CategoryService - Category service instance
     *
     */
    constructor(categoryService){
        this.categoryService = categoryService;
    }

    /**
     *@description ENDPOINT  POST /Category/ - creates a new Category
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    createCategory (req, res, next) {
        let categoryData = req.body;
        this.categoryService.createCategory(categoryData)
        then(
            data => {
                return res.send(responseFormatter(HttpStatus.OK, data));
            }
        ).catch( error => {
            console.log(`POST ERROR => ${error}`);
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        })
    };

    /**
     *@description ENDPOINT  GET /Category/ - Retrieves the list of all Categorys
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    listAll (req, res, next ) {
        this.categoryService.getAllCategories().then(
            data => {
                return res.send(responseFormatter(HttpStatus.OK, data));

            }
        ).catch( error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, error));
        });

    }

    /**
     *@description ENDPOINT  GET /:/id - get a Category by id
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    getCategory (req, res, next) {
        let id = Number(req.param('id'));
        this.categoryService.getCategory(id).then(
            data => {
                console.log(` GET Category => ${data}`);
                return res.send(responseFormatter(HttpStatus.OK, data));
            }).catch( error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });

        next();
    }

    /**
     *@description ENDPOINT  PUT /:/id - update a Category
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    updateCategory (req, res, next) {
        let id = req.param('id');
        let body = req.body;
        this.categoryService.editCategory(id, body).then(
            data => {
                return res.send(responseFormatter(HttpStatus.OK, data));
            }
        ).catch(error => {
            return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
        });
        next();
    }



    /**
     *@description ENDPOINT  DELETE /:/id - delete a Category
     *
     *@param  {object} req express request object
     *@param {object}  res express response object
     *@param {function} next express routing callback
     *@return {callback}
     */
    deleteCategory (req, res, next) {
        let id = Number(req.param('id'));
        this.categoryService.deleteCategory(id).then(
            data => {return res.send(responseFormatter(HttpStatus.OK, data));}
        ).catch(
            error => {
                return res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, {status : 'failed'}));
            }
        )
        next();
    }
}

module.exports = CategoryController;