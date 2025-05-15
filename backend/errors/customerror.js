export default class Customerror extends Error{
    constructor(code,message){
        this.status= code
        super(message)
    }
}