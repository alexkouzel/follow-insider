export async function post(url) {
    return await request(url, { method: 'POST' });
}

export async function postJson(url, json) {
    return await postData(url, 'application/json', JSON.stringify(json));
}

export async function postForm(url, form) {
    let contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
    return await postData(url, contentType, new URLSearchParams(form));
}

export async function getData(url, body = null) {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    const props = body
        ? { method: 'POST', body: JSON.stringify(body), headers: headers }
        : { method: 'GET', headers: headers };

    const data = await request(url, props);

    if (!data) {
        throw new Error('Invalid data: ' + data);
    }
    return data.json();
}

export async function getModel(url, convert, body = null) {
    const json = await getData(url, body);
    return convert(json);
}

export async function getModels(url, convert, body = null) {
    const json = await getData(url, body);
    return json.map(obj => convert(obj));
}

function postData(url, contentType, body) {
    return request(url, {
        method: 'POST',
        headers: { 'Content-Type': contentType },
        body: body,
    });
}

async function request(url, props) {
    props['redirect'] = 'follow';

    try {
        const response = await fetch(url, props);

        if (response.redirected) {
            window.location.href = response.url;
        }
        if (response.ok) {
            return response;
        }
        let json = await response.json();

        // TODO: Check the error object structure.
        throw new Error(json.message || response.statusText);

    } catch (error) {
        console.error('Request failed:', error);
    }
}