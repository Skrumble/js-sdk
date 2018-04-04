import Logger from "./Logger"

/**
 * @class Department
 * @classdesc
 * Departments are groups of users that can all recieve calls to that department, depending on the ring strategy. For applications implementing call center applications (with many agents recieving incoming {@link Call calls} to one extension). Departments are used for calling groups only, for information about chats with multiple users, see {@link Chat}
 *
 *
 * @summary
 * Creates a department
 *
 * @description
 * Departments are created with a list of {@link User users}, which defines which users are eligible to recieve calls for this department.  
 */
export class Department {

    constructor() {

        /**
         * @prop extension
         * @type {(String|String[])}
         */
        this.extension


    }



}
