import bcrypt from 'bcryptjs';

export const handler = async (event) => {
    const saltRounds = 10;
    let success;
    const promise = new Promise((res) => success = res);
    bcrypt.hash(event['value'], saltRounds, (err, hashedValue) => {
        if (err) {
            return success({ statusCode: 200, body: JSON.stringify({ message: 'failed', error: err }) });
        }
        const result = {
            "banner": "B00934518",
            "result": hashedValue,
            "arn": "arn:aws:lambda:us-east-1:730617025579:function:Bcrypt",
            "action": event['action'],
            "value": event['value']
        };
        const response = {
            statusCode: 200,
            body: JSON.stringify(result),
        };
        success(response);
    });
    return await promise;
};
