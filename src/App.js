import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";

const url = "http://20.231.202.18:8000/api/form";

class App extends Component {
  state = {
    data: [],
    modalInsert: false,
    form: {
      id: '',
      code: '',
      name: '',
      description: '',
      typeModal: '',
    },
    search: '',
  };

  componentDidMount() {
    this.peticionGet();
  }

  peticionGet = () => {
    axios.get(url)
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  peticionPost = () => {
    axios.post(url, this.state.form)
      .then((response) => {
        this.modalInsert();
        this.peticionGet();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  peticionPut = () => {
    axios.put(url + '/' + this.state.form.id, this.state.form)
      .then((response) => {
        this.modalInsert();
        this.peticionGet();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  peticionDelete = (id) => {
    axios.delete(url + '/' + id)
      .then((response) => {
        this.peticionGet();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  modalInsert = () => {
    this.setState({ modalInsert: !this.state.modalInsert });
  };

  selectForm = (form) => {
    this.setState({
      typeModal: 'update',
      form: {
        id: form.id,
        code: form.code,
        name: form.name,
        description: form.description,
      },
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'search') {
      this.setState({ search: value }, () => {
        this.peticionGet();
      });
    } else {
      this.setState((prevState) => ({
        form: {
          ...prevState.form,
          [name]: value,
        },
      }));
    }
  };
 

  filterData = () => {
    const { data, search } = this.state;

    if (!search) {
      return data;
    }

    const filteredData = data.filter((form) => {
      const { code, name, description } = form;
      const searchString = search.toLowerCase();

      return (
        code.toLowerCase().includes(searchString) ||
        name.toLowerCase().includes(searchString) ||
        description.toLowerCase().includes(searchString)
      );
    });

    return filteredData;
  };

  render() {
    const filteredData = this.filterData();

    return (
      <div className="App container">
        <br /><br /><br />
        <button className="btn btn-success" onClick={() => { this.setState({ typeModal: 'create' }); this.modalInsert(); }}>Agregar Form</button>
        <br /><br />
        <input
          className="form-control"
          type="text"
          name="search"
          id="search"
          placeholder="Buscar"
          onChange={this.handleChange}
          value={this.state.search}
        />
        <table className="table">
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((form) => (
              <tr key={form.id}>
                <td>{form.code}</td>
                <td>{form.name}</td>
                <td>{form.description}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => { this.selectForm(form); this.modalInsert(); }}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  {"   "}
                  <button className="btn btn-danger" onClick={() => this.peticionDelete(form.id)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal isOpen={this.state.modalInsert}>
          <ModalHeader style={{ display: 'block' }}>
            <span style={{ float: 'right' }} onClick={this.modalInsert}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
             
              <label htmlFor="code">Codigo</label>
              <input className="form-control" type="text" name="code" id="code" onChange={this.handleChange} value={this.state.form.code || ''} />
              <br />
              <label htmlFor="name">Nombre</label>
              <input className="form-control" type="text" name="name" id="name" onChange={this.handleChange} value={this.state.form.name || ''} />
              <br />
              <label htmlFor="description">Descripcion</label>
              <input className="form-control" type="text" name="description" id="description" onChange={this.handleChange} value={this.state.form.description || ''} />
            </div>
          </ModalBody>
          <ModalFooter>
            {this.state.typeModal === 'create' ?
              <button className="btn btn-success" onClick={this.peticionPost}>
                Insertar
              </button> :
              <button className="btn btn-success" onClick={this.peticionPut}>
                Actualizar
              </button>
            }
            <button className="btn btn-danger" onClick={this.modalInsert}>Cancelar</button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default App;