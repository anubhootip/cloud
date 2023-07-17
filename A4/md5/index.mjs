import crypto from 'crypto';

export const handler = async (event) => {
    const hash = crypto.createHash('md5');
    hash.update(event['value'] || '');
    const hashedValue = hash.digest('hex');
    const result = {
        "banner": "B00934518",
        "result": hashedValue,
        "arn": "arn:aws:lambda:us-east-1:730617025579:function:MD5",
        "action": event['action'],
        "value": event['value']
    };
    fetch(event.course_uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
    })
    const response = {
        statusCode: 200,
        body: JSON.stringify(result),
    };
    return response;
};
