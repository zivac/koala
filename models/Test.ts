import {Model, format} from '../core';

export class Test extends Model {

    public class: string = 'default';
    public name: string;
    //public phoneNumber: string | number;
    public categories: Array<string>;
    public tags: string[];
    public lotteryNumbers: [number];
    public author: {name: string};
    public comments: Array<{text: string, time: Date, author: {name: string}, likes: string[]}>;

    private password: string;

    setPassword = function(password: string) {
        this.password = password;
    }

}