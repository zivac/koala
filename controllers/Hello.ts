import {Controller, Route} from "../core";
import {Test} from "../models/Test";

@Controller({
    url: "/hello",
    before: [],
    after: []
})
export class HelloController {

    async _function() {
        return new Promise(function(resolve, reject) {
            resolve('whateva');
        })
    }

    async index(name, email, ctx) {
        var test = new Test({name, email});

        //test.save();
        //var test = await Test.findOne({name, email});
        test.setPassword('test');

        return {
            url: ctx.url,
            response: test
        };
    }

    async save(ctx) {
        var test = new Test();

        test.test = 'test 123';
        test.setPassword('mexican');
        console.log(test);
        await test.save();
        ctx.body = 'saved';
    }

    async find(ctx) {
        var tests = await Test.find({}, {limit: 2});
        console.log(tests[0] instanceof Test);
        tests[0].setPassword('nigger');
        tests[0].test = 'updated';
        tests[0].save();
        ctx.body = tests;
    }

    @Route({
        type: "POST",
        url: "/test"
    })
    fff(la, ctx) {
        console.log('handling', la)
        ctx.body = la;
    }

}