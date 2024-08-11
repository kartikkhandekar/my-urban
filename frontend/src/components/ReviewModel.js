import { Modal, ModalBody, ModalFooter, Button } from 'reactstrap';

export default function ReviewsModal({ isOpen, toggle, reviews }){
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalBody>
        {reviews.length === 0 ? (
          <p>No reviews available.</p>
        ) : (
            <>
            <h3>Reviews for Service : {reviews[0].service.servicename}</h3>
          <ul>
            {reviews.map((review, index) => (
              <li key={index}>
                <p><strong>{review.username}</strong> ({review.rating} stars):</p>
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Close</Button>
      </ModalFooter>
    </Modal>
  )
}


