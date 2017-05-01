/**
 * Created by barthclem on 4/22/17.
 */
/**
 *@description this is class handles all action that can be performed by a participant
 */
class roleUserService{

    /**
     *
     *@description roleUser Service Constructor
     *
     *@param  {object} role - role model instance
     *@param {object}  roleUser - roleUser model instance
     *
     */
    constructor(role, roleUser){
        this.role = role;
        this.roleUser = roleUser;
    }

    /**
     *
     *@description Get a role
     *
     *@param  {Integer} roleId - Integer role id
     *
     * @return {object} role - A role Object
     */

    getRole(roleId) {
        return new Promise((resolve, reject)=>{
            this.role().forge({id : roleId}).fetch()
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    return reject(error);
                })
        })

    }

    /**
     *
     *@description Get all roles from darabase
     *
     * @return {object} object - an object containing the list of roles
     */

    getAllRoles(roleId) {
        return new Promise((resolve, reject)=>{
            this.role().forge({id : roleId}).fetch()
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    return reject(error);
                })
        })

    }

    /**
     *
     *@description Create a role user
     *
     *@param  {object} roleUseData - Object containing eventId, roleId and userId
     *
     * @return {object} a newly created roleUser object
     */
    createRoleUser (roleUserData) {
        return new Promise((resolve, reject)=>{
            this.roleUser.forge().save(roleUserData)
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        })

    }

    /**
     *
     *@description Get a role user using roleUserId
     *
     *@param  {Integer} roleUserId - Role User Id
     *
     * @return {object} object - role data/error
     */
    getRoleUser (roleUserId) {
        return new Promise((resolve, reject)=>{
            this.roleUser.forge({id : roleUserId}).
            fetch({ withRelated : [ 'role']})
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        })
    }

    /**
     *
     *@description Get a role user
     *
     *@param  {Integer} userId - User Id
     *
     * @return {object} object - role data/error
     */
    getRoleUserByUserId (userId) {
        return new Promise((resolve, reject)=>{
            this.roleUser.forge()
                .where('user_id', '=', userId)
                .fetch({ withRelated : [ 'role']})
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        })

    }

    /**
     *
     *@description Get a role user using userId and dataGroupId
     *
     *@param  {Integer} userId - User Id
     *@param  {Integer} dataGroupId - Data Group Id
     *
     * @return {object} object - role data/error
     */
    getRoleUserByUser (userId, dataGroupId) {
        return new Promise((resolve, reject)=>{
            this.roleUser.forge({ userId: userId, dataGroupId : dataGroupId})
                .fetch({ withRelated : [ 'role']})
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        })

    }

    /**
     *
     *@description Get all roleUsers
     *
     *
     * @return {object} object - role data/error
     */
    getAllRoleUsers () {
        return new Promise((resolve, reject)=>{
            this.roleUser.forge().fetchAll()
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        })

    }

    /**
     *
     *@description Update a roleUser
     *
     *@param {Integer}  roleUserId - Role User Id
     *@param  {object} roleUserData - Object containing Role User Data
     * @return {object} object - an updated Role User Object/ Error
     */
    updateRoleUser (roleUserId, roleUserData) {
        return new Promise((resolve, reject)=>{
            this.roleUser.forge({id : roleUserId}).save(roleUserData)
                .then(data => {
                    return resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        })

    }


    /**
     *
     *@description Delete a roleUser
     *
     *@param {Integer}  roleUserId - Role User Id
     *
     *@return {object}/ Error
     */
    deleteRoleUser (roleUserId) {
        return new Promise((resolve, reject)=>{

        })

    }

    /**
     *
     *@description Delete all role user entries belonging to a user
     *
     *@param {Integer}  userId - User Id
     *
     *@return {object}/ Error
     */
    deleteRoleUserAtUser (userId) {
        return new Promise((resolve, reject)=>{

        })
        this.roleUser.forge()
            .query( qb => {
                qb.where('userId', '=', userId)
            })
            .destroy()
            .then(data => {
                return {message : "role user data deleted successfully"};
            })
            .catch(error => {
                throw error;
            });
    }
}

module.exports = roleUserService;