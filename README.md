## Setup Instructions

* Setup your OpenAI key:   `export OPENAI_API_KEY=<your key here>`
* Install requirements:    `pip install -r requirements.txt`
* Start running backend server:    `uvicorn main:app --reload`
* Install frontend requirements:    `cd client; npm install`
* In a separate tab, run the React app:    `npm start`

## Testing on your own data

Replace the files in the `examples/` folder with your own data and restart
the backend server.

## Contributing

If you plan to contribute make sure to format & lint your code before committing:
```
make format
make lint
```