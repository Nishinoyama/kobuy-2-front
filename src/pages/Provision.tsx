import React, {Component} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import axios from "axios";

interface ProvisionState {
  user_id: number | null
  validated: boolean,
  expiration_date_disable: boolean
}

export class Provision extends Component<{}, ProvisionState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      user_id: null,
      validated: false,
      expiration_date_disable: false,
    }
  }

  handleSubmit(e: any) {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      this.setState({validated: true})
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    const provider_id = 1; // todo!
    const name: string = form.name.value;
    const price: number = Number.parseInt(form.price.value);
    const unit: number = Number.parseInt(form.price.value);
    let expiration_date_raw = new Date(Date.parse(form.expiration_date.value))
    if (e.target.expiration_date_disable.checked) {
      expiration_date_raw = new Date(Date.parse("3000-01-01"))
    }
    const expiration_date = expiration_date_raw.toISOString();
    axios.post('http://localhost:8080/v1/api/groceries/provide',
      {
        provider_id,
        name,
        price,
        unit,
        expiration_date,
      },
      {
        withCredentials: true
      }
    ).then(res => {
      alert("出品完了" + JSON.stringify(res.data))
    }).catch(err => {
      e.preventDefault();
      e.stopPropagation();
      alert(err);
    })
    return false;
  }

  handleChange(e: any) {
    this.setState({
      expiration_date_disable: e.target.checked,
    })
  }

  componentDidMount() {
    axios.get('http://localhost:8080/authed/', {withCredentials: true})
      .then(res => {
        console.log(res);
        this.setState({
          user_id: res.data.user_id
        })
      })

  }

  render() {
    if (this.state.user_id === null) {
      return (
        <>
          <h1>出品にはログインが必要</h1>
        </>
      )
    }
    return (
      <>
        <h1>出品</h1>
        <Link to="." onClick={() => alert("未実装")}> 出品済みの商品をもとに出品する </Link>
        <Form
          onSubmit={(e) => this.handleSubmit(e)}
          noValidate
          validated={this.state.validated}
        >
          <Row className="mb-3">
            <Form.Group as={Col} controlId="name">
              <Form.Label>商品名</Form.Label>
              <Form.Control
                type="text"
                placeholder="商品名"
                required
              />
              <Form.Text className="text-muted">
                できるだけ正確に
              </Form.Text>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} md="7" controlId="price">
              <Form.Label>価格</Form.Label>
              <Form.Control
                type="number"
                step={10}
                min={0}
                defaultValue={0}
              />
              <Form.Text className="text-muted">
                10の倍数じゃなくても良い
              </Form.Text>
            </Form.Group>
            <Form.Group as={Col} md="5" controlId="unit">
              <Form.Label>個数</Form.Label>
              <Form.Control
                type="number"
                step={1}
                min={1}
                defaultValue={1}
              />
              <Form.Text className="text-muted">
                0個にすると見えなくなる
              </Form.Text>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} md="8" controlId="expiration_date">
              <Form.Label>
                賞味期限
              </Form.Label>
              <Form.Control type="date" defaultValue={(new Date(Date.now())).toISOString().split("T")[0]}
                            disabled={this.state.expiration_date_disable}/>
              <Form.Text className="text-muted">
                賞味期限がないものは、次をチェック
              </Form.Text>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="expiration_date_disable">
              <Form.Label>
                無期限
              </Form.Label>
              <Form.Check
                type="checkbox"
                onChange={(e) => this.handleChange(e)}
                id="expiration_date_disable"
                label="期限なし"
              />
            </Form.Group>
          </Row>
          <Button type="submit">出品！</Button>
        </Form>
      </>
    )
      ;
  }
}
