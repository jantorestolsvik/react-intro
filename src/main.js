import React from 'react';
import ReactDOM from 'react-dom';

let TodoApp = React.createClass({
    render: function () {
        return (
            <div>
                <Header />
                <section className="main">
                    <input
                        className="toggle-all"
                        type="checkbox"
                    />
                    <ul className="todo-list">
                        <TodoItem />
                    </ul>
                </section>
                <Footer />
            </div>
        );
    }
});

let Header = React.createClass({
    render: function () {
        return (
            <header className="header">
                <h1>todos</h1>
                <input
                    className="new-todo"
                    placeholder="What needs to be done?"
                />
            </header>
        );
    }
});

let TodoItem = React.createClass({
    render: function () {
        return (
            <li>
                <div className="view">
                    <input
                        className="toggle"
                        type="checkbox"
                    />
                    <label>
                        Test todo
                    </label>
                    <button className="destroy"/>
                </div>
                <input
                    className="edit"
                />
            </li>
        );
    }
});

let Footer = React.createClass({
    render: function () {
        return (
            <footer className="footer">
                <span className="todo-count">
                    <strong>123</strong> items left
                </span>
                <ul className="filters">
                    <li>
                        <a>
                            All
                        </a>
                    </li>
                    {' '}
                    <li>
                        <a>
                            Active
                        </a>
                    </li>
                    {' '}
                    <li>
                        <a>
                            Completed
                        </a>
                    </li>
                </ul>
                <button
                    className="clear-completed">
                    Clear completed
                </button>
            </footer>
        );
    }
});

ReactDOM.render(
<TodoApp />,
    document.getElementsByClassName('todoapp')[0]
);