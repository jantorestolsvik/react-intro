import React from 'react';
import ReactDOM from 'react-dom';

let TodoApp = React.createClass({
    render: function () {
        return (
            <h1>Hello World</h1>
        );
    }
});

ReactDOM.render(
<TodoApp />,
    document.getElementsByClassName('todoapp')[0]
);