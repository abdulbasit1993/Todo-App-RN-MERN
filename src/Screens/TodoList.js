import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import axios from 'axios';
import {COLORS} from '../utils/colors';

const API_BASE = 'http://192.168.0.111:3001';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    GetTodos();
  }, [todos]);

  const GetTodos = () => {
    axios
      .get(`${API_BASE}/todos`)
      .then(response => {
        // console.log('response ==> ', response.data);
        setTodos(response.data);
      })
      .catch(err => console.error('Error: ', err));
  };

  const completeTodo = async id => {
    const data = await axios.put(`${API_BASE}/todo/complete/${id}`);

    setTodos(todos =>
      todos.map(todo => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }

        return todo;
      }),
    );
  };

  const deleteTodo = async id => {
    const data = await axios.delete(`${API_BASE}/todo/delete/${id}`);

    setTodos(todos => todos.filter(todo => todo._id !== data._id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Todo List App!</Text>
      <Text style={styles.heading}>Your Tasks</Text>

      <View style={styles.todosContainer}>
        <FlatList
          data={todos}
          renderItem={({item}) => (
            <View style={styles.todo}>
              <TouchableOpacity onPress={() => completeTodo(item._id)}>
                <Text
                  style={item.complete ? styles.completedStyle : styles.text}>
                  {item.text}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteTodo}
                onPress={() => deleteTodo(item._id)}>
                <Text style={{color: COLORS.WHITE}}>X</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default TodoList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.DARKALT,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 15,
    color: COLORS.LIGHT,
  },
  text: {
    color: COLORS.LIGHT,
    fontSize: 20,
  },
  completedStyle: {
    color: COLORS.LIGHT,
    fontSize: 20,
    textDecorationLine: 'line-through',
  },
  deleteTodo: {
    color: COLORS.LIGHT,
    position: 'absolute',
    right: 16,
    backgroundColor: '#AF1E2D',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: 24,
    height: 24,
    fontSize: 16,
  },
  todosContainer: {
    margin: 10,
    padding: 10,
  },
  todo: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: COLORS.DARK,
  },
});
