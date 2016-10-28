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

    @Route({
        type: "POST",
        url: "/test"
    })
    fff(la, ctx) {
        console.log('handling', la)
        ctx.body = la;
    }

}