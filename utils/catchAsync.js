module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}

// basically we are returning a function which accepts a function and then it executes that function but it catches any errors and passes them to next 
// this is to wrap around our async functions