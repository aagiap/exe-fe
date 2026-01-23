"use client"
import {
    Container,
    Row,
    Col,
    Card,
    Button,
} from "react-bootstrap";
import {Link} from "react-router-dom";

const AdminDashboard = () => {
    return (
        <Container className="py-5">
            <Row>
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-warning text-dark">
                            <div className="d-flex justify-content-between align-items-center">
                                <h3 className="mb-0">Admin Dashboard</h3>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <p className="text-muted mb-4">
                                Welcome, <strong>Admin</strong>! You are in Admin mode.
                            </p>

                            {/* Manager Features */}
                            <Row className="mt-4">
                                <Col md={4}>
                                    <Card className="h-100">
                                        <Card.Body className="text-center">
                                            <h6>Feature</h6>
                                            <p className="text-muted small">Feature Description</p>
                                            <Button variant="outline-success" size="sm">
                                                View Feature
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="h-100">
                                        <Card.Body className="text-center">
                                            <h6>Feature</h6>
                                            <p className="text-muted small">Feature Description</p>
                                            <Button variant="outline-success" size="sm">
                                                View Feature
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="h-100">
                                        <Card.Body className="text-center">
                                            <h6>Product Management</h6>
                                            <p className="text-muted small">Manage your team's products</p>
                                            <Link to={"/admin/product-management"}>
                                                <Button variant="outline-success" size="sm">
                                                    View products
                                                </Button>
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <Row className="mt-4">
                                <Col md={4}>
                                    <Card className="h-100">
                                        <Card.Body className="text-center">
                                            <h6>Feature</h6>
                                            <p className="text-muted small">Feature Description</p>
                                            <Button variant="outline-success" size="sm">
                                                View Feature
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="h-100">
                                        <Card.Body className="text-center">
                                            <h6>Feature</h6>
                                            <p className="text-muted small">Feature Description</p>
                                            <Button variant="outline-success" size="sm">
                                                View Feature
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="h-100">
                                        <Card.Body className="text-center">
                                            <h6>Feature</h6>
                                            <p className="text-muted small">Feature Description</p>
                                            <Button variant="outline-success" size="sm">
                                                View Feature
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default AdminDashboard;