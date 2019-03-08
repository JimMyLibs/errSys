import save from './save'
import find from './find'

export default (app) => {
    app.post('/save', (req, res, next) => {
        save(req, res, next);
    })
    app.post('/find', (req, res, next) => {
        find(req, res, next);
    })
}