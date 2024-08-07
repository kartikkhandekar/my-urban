import axios from '../config/axios'
import { Container, Row, Col, Card, CardBody, CardText, Alert } from 'reactstrap';
import { useEffect } from 'react'
export default function Cancel(){
      
    const stripeId = localStorage.getItem('stripeId')
    useEffect(()=>{
        (async()=>{
           try{
            const response= await axios.put(`/payment-cancel/${stripeId}`)
            console.log('response from stripe put request',response.data)
           }catch(err){
            console.log(err)
           }
        })()
    },[])
    return (
        <div>
            <Container className="my-5">
      <Row className="justify-content-center">
        <Col md="8" lg="6">
          <Card body className="text-center">
            <CardBody>
              <Alert color="danger" className="mb-4">
                <h4 className="alert-heading">Payment Failure</h4>
                <CardText>
                  There was an issue with your payment. Please try again later or contact support if the problem persists.
                </CardText>
              </Alert>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
        </div>
    )
}