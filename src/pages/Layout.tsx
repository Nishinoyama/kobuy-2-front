import {Link, Outlet} from "react-router-dom";
import React from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import axios from "axios";

interface LoginStatus {
  logged_in: boolean,
  name: string,
  id: number,
  err: string | null,

  input_name: string,
  input_password: string,
}

export default class Layout extends React.Component<any, LoginStatus> {

  constructor(props: any) {
    super(props);
    this.state = {
      logged_in: false,
      name: "",
      id: 0,
      err: null,
      input_name: "",
      input_password: "",
    }
  }

  updateLogin() {
    axios.get('http://localhost:8080/authed/', {withCredentials: true})
      .then(res => {
        this.setState({
          logged_in: true,
          name: res.data.user_name,
          id: res.data.user_id,
          err: null,
        })
      })
      .catch(_ => {
        this.setState({
          logged_in: false,
          name: "",
          id: 0,
          err: null,
        })
      })
  }

  setErr(err: string) {
    this.setState({err})
  }

  componentDidMount() {
    this.updateLogin()
  }

  logout() {
    axios.get('http://localhost:8080/logout', {withCredentials: true})
      .then(_ => {
        this.updateLogin()
      })
      .finally(() => {
        window.location.reload()
      })
  }

  loginSubmit(e: any) {
    this.login(e.target.name.value, e.target.password.value)
  }

  login(user_name: string, password: string) {
    axios.post('http://localhost:8080/login', {user_name, password}, {withCredentials: true})
      .then(_ => {
        this.updateLogin()
      })
      .catch(_ =>
        this.setErr("ログイン失敗")
      )
  }

  render() {
    return (
      <>
        <header className="App-header">
          <h1>
            <Link to="/">Home</Link>
          </h1>
          <Form style={{display: "block"}} onSubmit={(e) => this.loginSubmit(e)}>
            <Row>
              <Col md={4}>
                <Form.Group controlId="name">
                  <Form.Control
                    type="text"
                    placeholder="name"
                    size="sm"
                    onChange={(e) => this.setState({input_name: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="password">
                  <Form.Control
                    type="password"
                    placeholder="password"
                    size="sm"
                    onChange={(e) => this.setState({input_password: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Button size="sm" type="submit">
                  login
                </Button>
              </Col>
              <Col>
                <Button size="sm" variant="secondary" onClick={() => this.logout()}>
                  logout
                </Button>
              </Col>
            </Row>
          </Form>
          <p>
            {this.state.logged_in ? `${this.state.name}としてログイン中` : (this.state.err ?? "未ログイン")}
          </p>
        </header>
        <main className="App-main">
          <Outlet/>
        </main>
      </>
    );
  }
}