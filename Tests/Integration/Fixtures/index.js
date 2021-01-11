const path = require('path')
const { readFileSync } = require('fs');
const { send } = require('micro');

module.exports = (req, res) => {
    switch (true) {
        case req.url === '/':
        case req.url.startsWith('/module'):
            send(res, 200, String(readFileSync(path.join(__dirname, 'host.html'))));
            break;
        case req.url === '/public/Styles/App.css':
            send(res, 200, String(readFileSync('../../Resources/Public/Styles/App.css')));
        case req.url === '/public/JavaScript/App.js':
            send(res, 200, String(readFileSync('../../Resources/Public/JavaScript/App.js')));
            break;
        case req.url.startsWith('/api/configuration'):
            send(res, 200, require('./configuration.json'));
            break;
        case req.url.startsWith('/api/prototype'):
            switch (true) {
                default:
                case req.url.includes('Component.Foo'):
                    send(res, 200, require('./prototype-foo.json'));
                    break;
                case req.url.includes('Component.Bar'):
                    send(res, 200, require('./prototype-bar.json'));
                    break;
            }
        case req.url.startsWith('/preview'):
            switch (true) {
                default:
                case req.url.includes('Component.Foo'):
                    send(res, 200, String(readFileSync(path.join(__dirname, 'component-foo.html'))));
                    break;
                case req.url.includes('Component.Bar'):
                    send(res, 200, String(readFileSync(path.join(__dirname, 'component-bar.html'))));
                    break;
            }
        default:
            send(res, 404, `<h1>Not found</h1>`);
            break;
    }
}
