import React from 'react';
import { Container, Row, Col, Button, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
const EmptyCart = () => {
    const navigate=useNavigate()
    const handleClick=()=>{
        navigate('/')
    }
    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md="6">
                    <Card className="text-center">
                        <CardBody>
                            <CardTitle tag="h5">Your Cart is Empty</CardTitle>
                            <CardText>Add some services to get started.</CardText>
                            <Button color="primary" onClick={handleClick}>Add Services</Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EmptyCart;
