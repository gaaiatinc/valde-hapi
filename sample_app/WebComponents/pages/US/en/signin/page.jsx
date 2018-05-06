/**
 * @author Ali Ismael <ali@gaaiat.com>
 */
"use strict";

import React from "react";

import RootTemplate from "pages/templates/root_react_template";

import {Container, Row, Col} from "reactstrap";
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    FormText
} from "reactstrap";

/**
 * An example of how to extend the parent template, and replace the elements that the
 * parent template allows for overriding.
 */
export default class AppMainPage extends RootTemplate {
    constructor(props) {
        super(props);

        // this.bodyTop = <PageBodyTop />;
        // this.bodyMain = <PageBodyMain id="t24" ref={(bdyMnRef) => {
        //     this.__bodyMainRef = bdyMnRef;
        // }} />;
        // this.bodyBottom = <PageBodyBottom id="q122" onClick={() => {
        //     this.__bodyMainRef.setNewGraphData({age: Math.random()});
        // }} />;
    }

    /**
     * [handleClick description]
     * @return {[type]} [description]
     */
    handleClick() {
        this
            .__bodyMainRef
            .setState({age: Math.random()});
    }

    /**
     * You should never override the render method of the parent template!
     */
    createBody() {

        let redirect_uri;
        try {
            redirect_uri = this
                .props
                .model
                .requestInfo
                .query["redirect_uri"];
        } catch (err) {
            //
        }

        let action_string = "/sample_app/api/v1/account/signin";
        if (redirect_uri) {
            action_string += "?redirect_uri=" + redirect_uri;
        }

        if (this.props.model.requestInfo.query["authorization_request_id"]) {
            action_string += "?authorization_request_id=" + this
                .props
                .model
                .requestInfo
                .query["authorization_request_id"];
        }

        console.log("action_string", action_string);

        return (<Container fluid="true">
            <Row>
                <Col sm={{
                        size: 8,
                        offset: 2
                }} xs={{
                        size: 12
                }}>
                    <h1>OpenID-Connect 2.0</h1>
                </Col>
            </Row>
            <Row>
                <Col sm={{
                        size: 8,
                        offset: 2
                }} xs="12">
                    <h1></h1>
                </Col>
            </Row>
            <Row>
                <Col sm={{
                        size: 8,
                        offset: 2
                }} xs={{
                        size: 12
                }}>

                    <Form method="POST" action={action_string} horizontal="horizontal">

                        <FormGroup>
                            <Label for="exampleEmail">Email</Label>
                            <Input type="email" name="username" id="exampleEmail" placeholder="Email"/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="examplePassword">Password</Label>
                            <Input type="password" name="password" id="examplePassword" placeholder="Password"/>
                        </FormGroup>

                        <FormGroup check="check">
                            <Label check="check">
                                <Input type="checkbox"/>{' '}
                                Remember me
                            </Label>
                        </FormGroup>

                        <FormGroup>
                            <Button color="primary" type="submit">
                                Sign in
                            </Button>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
        </Container>);
    }
}
