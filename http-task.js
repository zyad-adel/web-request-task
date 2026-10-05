const http = require('http');

const server = http.createServer((req, res) => {

    if (req.url === '/home' && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        
        const home = [
            { id: 1, title: 'Welcome Home' },
            { id: 2, title: 'Home Page' }
        ];

        res.end(JSON.stringify(home));
    } 
    else if (req.url === '/users' && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        const users = [
            { id: 1, name: 'Ahmed', age: 25 },
            { id: 2, name: 'Mohamed', age: 22 }
        ];

        res.end(JSON.stringify(users));
    } 
    else if (req.url === '/products' && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        const products = [
            { id: 1, name: 'Laptop', price: 25000 },
            { id: 2, name: 'Phone', price: 15000 }
        ];

        res.end(JSON.stringify(products));
    } 
    else if (req.url === '/add-user' && req.method === 'POST') {
        let body = '';

        req.on('data', (chunk) => {
            body = body + chunk.toString();
        });

        req.on('end', () => {
            const data = JSON.parse(body);

            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');

            res.end(JSON.stringify({
                message: 'Data received',
                data: data
            }));
        });
    } 
    else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        
        res.end(JSON.stringify({
            message: 'Page Not Found'
        }));
    }

});

server.listen(4000, () => {
    console.log('Server is running on port 4000');
});