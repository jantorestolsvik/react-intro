import React from 'react';
import ReactDOM from 'react-dom';
import {pluralize} from './Utils';

let ALL_TODOS = 'all';
let ACTIVE_TODOS = 'active';
let COMPLETED_TODOS = 'completed';

let TodoApp = React.createClass({
    getInitialState: function () {
        return {
            todos: [],
            nowShowing: ALL_TODOS,
            editing: null
        };
    },
    render: function () {
        var todos = this.state.todos;
        let todoItems = todos.filter((todo) => {
            switch (this.state.nowShowing) {
                case ACTIVE_TODOS:
                    return !todo.completed;
                case COMPLETED_TODOS:
                    return todo.completed;
                default:
                    return true;
            }
        }).map((todo) => {
            return (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    editing={this.state.editing === todo.id}
                />
            );
        });

        let footer = false;

        var activeTodoCount = todos.reduce(function (accum, todo) {
            return todo.completed ? accum : accum + 1;
        }, 0);

        var completedCount = todos.length - activeTodoCount;

        if (activeTodoCount || completedCount) {
            footer =
                <Footer
                    count={activeTodoCount}
                    completedCount={completedCount}
                    nowShowing={this.state.nowShowing}
                />;
        }

        return (
            <div>
                <Header />
                <section className="main">
                    <input
                        className="toggle-all"
                        type="checkbox"
                        checked={activeTodoCount === 0}
                    />
                    <ul className="todo-list">
                        {todoItems}
                    </ul>
                </section>
                {footer}
            </div>
        );
    }
});

let Header = React.createClass({
    getInitialState: function () {
        return {
            text: ''
        };
    },
    render: function () {
        return (
            <header className="header">
                <h1>todos</h1>
                <input
                    className="new-todo"
                    placeholder="What needs to be done?"
                    value={this.state.text}
                />
            </header>
        );
    }
});

let TodoItem = React.createClass({
    getInitialState: function () {
        return {editText: this.props.todo.title};
    },
    render: function () {
        let liClassNames = [];
        if (this.props.todo.completed) {
            liClassNames.push("completed");
        }
        if (this.props.editing) {
            liClassNames.push("editing");
        }
        return (
            <li className={liClassNames.join(" ")}>
                <div className="view">
                    <input
                        className="toggle"
                        type="checkbox"
                        checked={this.props.todo.completed}
                    />
                    <label>
                        {this.props.todo.title}
                    </label>
                    <button className="destroy"/>
                </div>
                <input
                    className="edit"
                    value={this.state.editText}
                />
            </li>
        );
    }
});

let Footer = React.createClass({
    render: function () {
        var activeTodoWord = pluralize(this.props.count, 'item');
        var clearButton = false;

        if (this.props.completedCount > 0) {
            clearButton = (
                <button
                    className="clear-completed">
                    Clear completed
                </button>
            );
        }
        let nowShowing = this.props.nowShowing;
        return (
            <footer className="footer">
                <span className="todo-count">
                    <strong>{this.props.count}</strong> {activeTodoWord} left
                </span>
                <ul className="filters">
                    <li>
                        <a
                            className={nowShowing === ALL_TODOS ? "selected" : ""}>
                            All
                        </a>
                    </li>
                    {' '}
                    <li>
                        <a
                            className={nowShowing === ACTIVE_TODOS ? "selected" : ""}>
                            Active
                        </a>
                    </li>
                    {' '}
                    <li>
                        <a
                            className={nowShowing === COMPLETED_TODOS ? "selected" : ""}>
                            Completed
                        </a>
                    </li>
                </ul>
                {clearButton}
            </footer>
        );
    }
});

ReactDOM.render(
    <TodoApp />,
    document.getElementsByClassName('todoapp')[0]
);