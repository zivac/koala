export function Controller(properties: Object) {
    return (target: Object) => {
        target['_metadata'] = properties;
    }
}

export function Route(properties: Object) {
    return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
        target[propertyKey]._metadata = properties;
    }
}

export function format(format: string) {
    return function(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        if(target['_metadata'].propertyKey) target['_metadata'].propertyKey.format = format;
        else target['_metadata'].propertyKey = {format: format};
    }
}