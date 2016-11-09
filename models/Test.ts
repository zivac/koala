import {Model, format} from '../core';

export class Test extends Model {

    public test = 'test';
    public class: String;
    public name: string;
    //public phoneNumber: string | number;
    public categories: Array<String[]>;
    public tags: Array<String[]>;
    public lotteryNumbers: [String];
    public author: {name: String};
    public comments: Array<{text: String, time: Date, author: {name: String}, likes: String[]}>;

    public password: String;

    setPassword(password: String) {
        console.log('called', password);
        this.password = password;
        this.test = 'changed';
        console.log(this);
        console.log(this.password);
    }

}