import React from 'react';
import ReactDOM from 'react-dom';
import {pluralize, uuid} from './Utils';

let ALL_TODOS = 'all';
let ACTIVE_TODOS = 'active';
let COMPLETED_TODOS = 'completed';

let ENTER_KEY = 13;
let ESCAPE_KEY = 27;

let TodoApp = React.createClass({
    getInitialState: function () {
        return {
            todos: [],
            nowShowing: ALL_TODOS,
            editing: null
        };
    },
    handleNewTodo: function (text) {
        var val = text.trim();

        if (val) {
            this.setState({
                newTodo: '',
                todos: this.state.todos.concat({
                    id: uuid(),
                    title: val,
                    completed: false
                })
            });
        }
    },
    toggleAll: function (event) {
        var checked = event.target.checked;
        this.setState({
            todos: this.state.todos.map((todo) => {
                todo.completed = checked;
                return todo;
            })
        })
    },
    toggle: function (todoToToggle) {
        this.setState({
            todos: this.state.todos.map((todo) => {
                return todo !== todoToToggle ?
                    todo :
                    Object.assign({}, todo, {completed: !todo.completed});
            })
        })
    },
    destroy: function destroy(todoToDestroy) {
        this.setState({
            todos: this.state.todos.filter(function (todo) {
                return todo !== todoToDestroy;
            })
        });
    },

    edit: function edit(todo) {
        this.setState({ editing: todo.id });
    },

    save: function save(todoToSave, text) {
        this.setState({
            todos: this.state.todos.map(function (todo) {
                return todo !== todoToSave ? todo : Object.assign({}, todo, { title: text });
            }),
            editing: null
        });
    },

    cancel: function cancel() {
        this.setState({ editing: null });
    },

    clearCompleted: function clearCompleted() {
        this.setState({
            todos: this.state.todos.filter(function (todo) {
                return !todo.completed;
            })
        });
    },
    filterSelected: function (filter) {
        this.setState({nowShowing: filter});
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
                    onToggle={this.toggle.bind(this, todo)}
                    onDestroy={this.destroy.bind(this, todo)}
                    onEdit={this.edit.bind(this, todo)}
                    onSave={this.save.bind(this, todo)}
                    onCancel={this.cancel}
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
                    onClearCompleted={this.clearCompleted}
                    filterSelected={this.filterSelected}
                />;
        }

        return (
            <div>
                <Header
                    onNewTodo={this.handleNewTodo}
                />
                <section className="main">
                    <input
                        className="toggle-all"
                        type="checkbox"
                        onChange={this.toggleAll}
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
    handleKeyDown: function (event) {
        if (event.keyCode !== ENTER_KEY) {
            return;
        }
        event.preventDefault();
        this.setState({text: ""});
        this.props.onNewTodo(this.state.text);
    },
    handleChange: function (event) {
        this.setState({text: event.target.value});
    },
    render: function () {
        return (
            <header className="header">
                <h1>todos</h1>
                <input
                    className="new-todo"
                    placeholder="What needs to be done?"
                    value={this.state.text}
                    onKeyDown={this.handleKeyDown}
                    onChange={this.handleChange}
                />
            </header>
        );
    }
});

let TodoItem = React.createClass({
    getInitialState: function () {
        return {editText: this.props.todo.title};
    },
    componentDidUpdate: function (prevProps) {
        let input = this.input;
        if (input !== null && !prevProps.editing && this.props.editing) {
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
        }
    },
    handleSubmit: function (event) {
        var val = this.state.editText.trim();
        if (val) {
            this.props.onSave(val);
            this.setState({editText: val});
        } else {
            this.props.onDestroy();
        }
    },

    handleEdit: function () {
        this.props.onEdit();
        this.setState({editText: this.props.todo.title});
    },

    handleKeyDown: function (event) {
        if (event.which === ESCAPE_KEY) {
            this.setState({editText: this.props.todo.title});
            this.props.onCancel(event);
        } else if (event.which === ENTER_KEY) {
            this.handleSubmit(event);
        }
    },

    handleChange: function (event) {
        if (this.props.editing) {
            this.setState({editText: event.target.value});
        }
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
                        onChange={this.props.onToggle}
                    />
                    <label
                        onDoubleClick={this.handleEdit}
                    >
                        {this.props.todo.title}
                    </label>
                    <button
                        className="destroy"
                        onClick={this.props.onDestroy}
                    />
                </div>
                <input
                    className="edit"
                    value={this.state.editText}
                    onBlur={this.handleSubmit}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                    ref={(ref) => {this.input = ref}}
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
                    className="clear-completed"
                    onClick={this.props.onClearCompleted}
                >
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
                            href="#"
                            onClick={() => {this.props.filterSelected(ALL_TODOS)}}
                            className={nowShowing === ALL_TODOS ? "selected" : ""}>
                            All
                        </a>
                    </li>
                    {' '}
                    <li>
                        <a
                            href="#"
                            onClick={() => {this.props.filterSelected(ACTIVE_TODOS)}}
                            className={nowShowing === ACTIVE_TODOS ? "selected" : ""}>
                            Active
                        </a>
                    </li>
                    {' '}
                    <li>
                        <a
                            href="#"
                            onClick={() => {this.props.filterSelected(COMPLETED_TODOS)}}
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