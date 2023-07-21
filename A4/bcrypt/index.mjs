import bcrypt from 'bcryptjs';

export const handler = async (event) => {
    const saltRounds = 10;
    let success;
    const promise = new Promise((res) => success = res);
    const hashedValue = await bcrypt.hash(event['value'], saltRounds);
    const result = {
        "banner": "B00934518",
        "result": hashedValue,
        "arn": "arn:aws:lambda:us-east-1:730617025579:function:Bcrypt",
        "action": event['action'],
        "value": event['value']
    };
    return await fetch(event.course_uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
    })
        .catch(console.log)
        .finally(() => success(result));
};