# browser-alert-service
*Small app to prototype some ideas about real time lead service for browser display.*


## **Setup**

 Install project

    npm install

Run server

    npm start

then surf on over to view in browser:

    http://0.0.0.0:8080


### **Site**
 Uses [socket.io](http://socket.io), [fixedDataTable](https://facebook.github.io/fixed-data-table/), [PNotify](http://sciactive.github.io/pnotify/) to display incoming data in real time.

### **Mock Client**
 Uses [socket.io](http://socket.io), [timeplan](https://www.npmjs.com/package/timeplan), [throttled-request](https://www.npmjs.com/package/throttled-request), and [chance](https://www.npmjs.com/package/chance) to generate fake client data.

### **Development**
 Used [browsersync](http://www.browsersync.io) in the beginning to set up html and then [nodemon](http://nodemon.io) after for everything else.


