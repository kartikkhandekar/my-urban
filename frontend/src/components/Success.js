import axios from "../config/axios"
import { useEffect } from "react"
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Alert } from 'reactstrap';
import { CheckCircle } from 'react-feather';

export default function Success(){
   
    
    const stripeId = localStorage.getItem('stripeId')
    useEffect(()=>{
        (async()=>{
           try{
            const response= await axios.put(`/payment-success/${stripeId}`)
            console.log('response from stripe put request',response.data)
           }catch(err){
            console.log(err)
           }
        })()
    },[])
    return (
        <div style={{ paddingTop: '80px' }}>
             <Container className="my-5">
            <Row className="justify-content-center">
                <Col md="8" lg="6">
                    <Card body className="text-center">
                        <CardBody>
                            <CheckCircle size={50} color="green" className="mb-3" />
                            <CardTitle tag="h3">Payment Successful</CardTitle>
                            <CardText>
                                Your payment has been processed successfully. Thank you for your payment!
                            </CardText>
                            <Alert color="success">
                                <strong>Success!</strong> Your payment was completed successfully.
                            </Alert>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
        </div>
    )
}