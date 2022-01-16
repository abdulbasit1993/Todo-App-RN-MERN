import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import axios from 'axios';
import {COLORS} from '../utils/colors';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';

const width = Dimensions.get('window').width;

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

  const addTodo = async () => {
    if (newTodo == '') {
      Alert.alert('Error!', 'Please enter a task first!');
      return;
    } else {
      await axios
        .post(`${API_BASE}/todo/new`, {
          text: newTodo,
        })
        .then(function (response) {
          const data = response.data;
          setTodos([...todos, data]);
          setModalActive(false);
          setNewTodo('');
        })
        .catch(function (error) {
          console.log('Error: ', error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.DARKALT} />
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

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setModalActive(true);
        }}>
        <MaterialIcon name="add" size={32} color={COLORS.LIGHT} />
      </TouchableOpacity>

      <Modal
        isVisible={modalActive}
        animationIn={'slideInUp'}
        animationOut={'slideInDown'}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={() => setModalActive(false)}>
            <Text style={styles.modalCloseBtnText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.addTaskHeading}>Add Task</Text>
          <TextInput
            style={styles.taskInput}
            placeholder="Enter task here.."
            onChangeText={text => setNewTodo(text)}
            value={newTodo}
          />
          <TouchableOpacity style={styles.createBtn} onPress={() => addTodo()}>
            <Text style={styles.createBtnText}>Create Task</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  addButton: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 90,
    backgroundColor: COLORS.PRIMARY,
    elevation: 1,
  },
  addButtonText: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.LIGHT,
  },
  modalView: {
    backgroundColor: COLORS.LIGHT,
    borderRadius: 40,
    width: width * 0.9,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtn: {
    backgroundColor: 'red',
    padding: 10,
    margin: 10,
    width: 40,
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 20,
  },
  modalCloseBtnText: {color: COLORS.WHITE, fontSize: 18, textAlign: 'center'},
  addTaskHeading: {
    color: COLORS.DARK,
    marginBottom: 16,
    fontWeight: '400',
    textTransform: 'uppercase',
    fontSize: 25,
  },
  taskInput: {
    backgroundColor: COLORS.WHITE,
    width: width * 0.7,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },
  createBtn: {
    backgroundColor: COLORS.PRIMARY,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 32,
    paddingRight: 32,
    borderRadius: 90,
    marginTop: 16,
  },
  createBtnText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS.WHITE,
  },
});
