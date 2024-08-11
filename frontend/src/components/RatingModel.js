import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';
import axios from '../config/axios';

export default function RatingModal ({ isOpen, toggle, booking, onSubmit }) {
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(null)
    const [comment, setComment] = useState('')

    const handleRatingSubmit = async () => {
        try {
            await axios.post(`/review/${booking._id}`, {
                rating,
                comment,
            }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            toast.success('Review submitted successfully!')
            onSubmit();
        } catch (error) {
            toast.error('Failed to submit review');
            console.error(error)
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Rate Your Experience</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="rating">Rating</Label>
                        <div className="star-rating">
                            {[...Array(5)].map((star, index) => {
                                const currentRating = index + 1
                                return (
                                    <FaStar
                                        key={index}
                                        size={30}
                                        className="star"
                                        color={currentRating <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                                        onMouseEnter={() => setHover(currentRating)}
                                        onMouseLeave={() => setHover(null)}
                                        onClick={() => setRating(currentRating)}
                                    />
                                )
                            })}
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label for="comment">Comment</Label>
                        <Input
                            type="textarea"
                            name="comment"
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleRatingSubmit} disabled={rating === 0}>
                    Submit
                </Button>{' '}
                <Button color="secondary" onClick={toggle}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};

