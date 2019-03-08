import save from './save'

export default (app) => {
    app.post('/error', (req, res, next) => {
        save(req, res, next);
    })
}