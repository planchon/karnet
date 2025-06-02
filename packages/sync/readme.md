# sync

the sync package is made to have a seemless sync between frontend and backend, rendering the application realtime but also offline first

## goals

- [ ] offline first system
- [ ] flicker free
- [ ] migrations need to be easy

## architecture

### local first strategy

the sync layer need to be local first

figma blog post : https://www.notion.com/blog/how-we-sped-up-notion-in-the-browser-with-wasm-sqlite
takeaway :

- a new worker
- OPFS to store the SQLite file
- sqlite in the worker
- comlink to communicate with the worker

### reactive

mobx is doing the interaction between the worker and react

when something updates in the UI:

- mobx memory keeps it
- a reaction is played
- a transaction is created
- the transaction is save in sqlite `transaction` table
- the table is flushed when needed

### syncronized

the sync worker has a websocket connection opened with the database

when an update arrives:

- the transaction is saved in `transaction` table
- the sqlite object is updated
- mobx is informed
- the render is done
