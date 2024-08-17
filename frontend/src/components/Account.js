import React, { useState, useEffect } from 'react';
import axios from '../config/axios'
import { useAuth } from '../context/Auth'
import { Container, Row, Col, Card, CardBody, CardImg, CardText, CardTitle } from 'reactstrap';

const Account = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let response;
        

        if (user.account.role === 'customer') {
          response = await axios.get('/customer', {
            headers: { Authorization: localStorage.getItem('token') },
            withCredentials: true
          });
        } else if (user.account.role === 'service-provider') {
          response = await axios.get('/provider', {
            headers: { Authorization: localStorage.getItem('token') },
            withCredentials: true
          });
        }


        if (response && response.data) {
          setProfile(response.data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Error fetching profile');
        alert(err.message)
      } finally {
        setLoading(false);
      }
    };

    if (user && user.account && user.account.role) {
      fetchProfile();
    }
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!profile) {
    return <p>No profile created.</p>;
  }

  return (
    <section className="vh-100 d-flex align-items-center">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg="8" md="10" className="mb-4">
            <Card className="mb-4" style={{ borderRadius: '.5rem' }}>
              <Row className="g-0">
                <Col md="4" className="gradient-custom text-center text-white"
                  style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                  <CardImg
                    src={profile.profilePic} alt="Profile"
                    className="my-5 img-fluid"
                    style={{ width: '120px', borderRadius: '50%' }}
                  />
                  <CardTitle tag="h5">{profile.name}</CardTitle>
                  <CardText>{user.account.role}</CardText>
                </Col>

                <Col md="8">
                  <CardBody className="p-4">
                    <CardTitle tag="h6">Information</CardTitle>
                    <hr className="mt-0 mb-4" />
                    <Row className="pt-1">
                      <Col sm="6" className="mb-3">
                        <CardTitle tag="h6">First Name</CardTitle>
                        <CardText className="text-muted">{user.account.username}</CardText>
                      </Col>
                      <Col sm="6" className="mb-3">
                        <CardTitle tag="h6">Email</CardTitle>
                        <CardText className="text-muted">{user.account.email}</CardText>
                      </Col>
                      
                    </Row>
                    {user.account.role === 'customer' && (
                      <>
                        <CardTitle tag="h6">Customer Details</CardTitle>
                        <hr className="mt-0 mb-4" />
                        <Row className="pt-1">
                          <Col sm="6" className="mb-3">
                            <CardTitle tag="h6">Address</CardTitle>
                            <CardText className="text-muted">{profile.address}</CardText>
                          </Col>
                          <Col sm="6" className="mb-3">
                            <CardTitle tag="h6">Phone No</CardTitle>
                            <CardText className="text-muted">{profile.phone}</CardText>
                          </Col>
                        </Row>
                      </>
                    )}
                    {user.account.role === 'service-provider' && (
                      <>
                        <CardTitle tag="h6">Providers Details</CardTitle>
                        <hr className="mt-0 mb-4" />
                        <Row className="pt-1">
                          <Col sm="6" className="mb-3">
                            <CardTitle tag="h6">Aadhaar Photo</CardTitle>
                            <CardImg
                              src={profile.aadhaarPhoto} alt="Aadhaar"
                              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                            />
                          </Col>
                          <Col sm="6" className="mb-3">
                            <CardTitle tag="h6">Phone No</CardTitle>
                            <CardText className="text-muted">{profile.phone}</CardText>
                          </Col>
                        </Row>
                      </>
                    )}
                  </CardBody>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Account;
