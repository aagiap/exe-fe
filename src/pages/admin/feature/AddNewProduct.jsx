import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import productManagerApi from "../../../api/ProductManagerApi";
import {Link} from "react-router-dom";
import {BoxArrowRight, House, Speedometer2, ArrowReturnLeft} from "react-bootstrap-icons";

const AddNewProduct = () => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        originalPrice: '',
        discountedPrice: '',
        thumbnail: '',
        galleryImages: [],
        isFeatured: false,
        isActive: true,
        categoryId: '',
        categoryName: ''
    });

    const [galleryImageInput, setGalleryImageInput] = useState('');
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    //state cho thumbnail preview
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    //state cho gallery previews
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    //navigate để trở về trang trước đó
    const naviagate = useNavigate();

    const thumbnailInputRef = React.useRef(null);
    const galleryInputRef = React.useRef(null);
    useEffect(() => {
        fetchCategories();
    },[])

    // Thêm useEffect để cleanup
    useEffect(() => {
        return () => {
            // Cleanup thumbnail preview URL
            if (thumbnailPreview) {
                URL.revokeObjectURL(thumbnailPreview);
            }

            // Cleanup gallery preview URLs
            galleryPreviews.forEach(preview => {
                URL.revokeObjectURL(preview);
            });
        };
    }, [thumbnailPreview, galleryPreviews]);

    const fetchCategories = async () => {
        try {
            const response = await productManagerApi.getCategories();
            if (response.message === "success") {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // hàm xử lý upload thumbnail
    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Nếu đã có thumbnail trước đó, revoke URL cũ
            if (thumbnailPreview) {
                URL.revokeObjectURL(thumbnailPreview);
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setProduct(prev => ({ ...prev, thumbnail: base64String }));
                setThumbnailPreview(URL.createObjectURL(file));
            };
            reader.readAsDataURL(file);
        }
    };

    // hàm xử lý thêm gallery images
    const handleGalleryImagesUpload = (e) => {
        const files = Array.from(e.target.files);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setProduct(prev => ({
                    ...prev,
                    galleryImages: [...prev.galleryImages, base64String]
                }));

                // Tạo preview URL
                const previewUrl = URL.createObjectURL(file);
                setGalleryPreviews(prev => [...prev, previewUrl]);
            };
            reader.readAsDataURL(file);
        });
    };

    // Hàm xóa thumbnail
    const handleRemoveThumbnail = () => {
        // Revoke object URL để tránh memory leak
        if (thumbnailPreview) {
            URL.revokeObjectURL(thumbnailPreview);
        }
        // Reset thumbnail và preview
        setProduct(prev => ({ ...prev, thumbnail: '' }));
        setThumbnailPreview('');
        // Reset input file
        if (thumbnailInputRef.current) {
            thumbnailInputRef.current.value = '';
        }
    };

    // hàm xóa gallery image
    const handleRemoveGalleryImage = (index) => {
        setProduct(prev => ({
            ...prev,
            galleryImages: prev.galleryImages.filter((_, i) => i !== index)
        }));

        // Xóa preview tương ứng
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Chuyển đổi dữ liệu trước khi gửi
        const productData = {
            ...product,
            originalPrice: parseFloat(product.originalPrice) || 0,
            discountedPrice: parseFloat(product.discountedPrice) || 0,
            categoryId: product.categoryId ? parseInt(product.categoryId) : null,
            // Lấy tên category từ dropdown
            categoryName: categories.find(c => c.id == product.categoryId)?.name || ''
        };

        console.log('Product Data:', productData);

        try {
            const response = await productManagerApi.addProduct(productData);
            console.log(response.data);
        }catch (error) {

        }
    };

    // Thêm hàm reset form
    const resetForm = () => {
        // Reset product state
        setProduct({
            name: '',
            description: '',
            originalPrice: '',
            discountedPrice: '',
            thumbnail: '',
            galleryImages: [],
            isFeatured: false,
            isActive: true,
            categoryId: '',
            categoryName: ''
        });

        // Revoke và reset thumbnail preview
        if (thumbnailPreview) {
            URL.revokeObjectURL(thumbnailPreview);
            setThumbnailPreview('');
        }

        // Revoke và reset gallery previews
        galleryPreviews.forEach(preview => {
            URL.revokeObjectURL(preview);
        });
        setGalleryPreviews([]);

        // Reset input files
        if (thumbnailInputRef.current) {
            thumbnailInputRef.current.value = '';
        }
        if (galleryInputRef.current) {
            galleryInputRef.current.value = '';
        }
    };

    return (
        <Container className="py-4">
            {/* Header với tiêu đề chính */}
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="fw-bold">Thêm sản phẩm mới</h2>
                </Col>
                <Col className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                        {/*Nút trở về trang trước đó*/}
                        <Button variant={"outline-secondary"} size={"sm"} onClick={() => {naviagate(-1)}}>
                            <ArrowReturnLeft className={"me-1"} size={"14"}/>
                            Trở về trang trước đó
                        </Button>

                        {/* Nút trở về bảng điều khiển */}
                        <Link to="/admin/dashboard">
                            <Button variant="outline-secondary" size="sm">
                                <Speedometer2 className="me-1" size={14} />
                                Bảng điều khiển
                            </Button>
                        </Link>

                        {/* Nút trở về trang chủ */}
                        <Link to="/">
                            <Button variant="outline-secondary" size="sm">
                                <House className="me-1" size={14} />
                                Trang chủ
                            </Button>
                        </Link>

                        {/* Nút đăng xuất */}
                        <Button
                            variant="outline-danger"
                            size="sm"
                        >
                            <BoxArrowRight className="me-1" size={14} />
                            Đăng xuất
                        </Button>
                    </div>
                </Col>
            </Row>
            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* General Information */}
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Tên sản phẩm</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                placeholder="Nhập tên sản phẩm"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Mô tả</strong></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                placeholder="Nhập mô tả"
                                required
                            />
                        </Form.Group>

                        {/* Pricing */}
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label><strong>Giá gốc (VND)</strong></Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="originalPrice"
                                        value={product.originalPrice}
                                        onChange={handleChange}
                                        placeholder="Nhập giá gốc"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label><strong>Giá đã giảm (VND)</strong> <small className="text-muted">(Tuỳ chọn)</small></Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="discountedPrice"
                                        value={product.discountedPrice}
                                        onChange={handleChange}
                                        placeholder="Nhập giá giảm"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Category */}
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label><strong>Danh mục</strong></Form.Label>
                                    <Form.Select
                                        name="categoryId"
                                        value={product.categoryId}
                                        onChange={handleChange}
                                        required
                                        disabled={loadingCategories}
                                    >
                                        <option value="">Chọn một danh mục</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {product.categoryId && (
                                        <Form.Control
                                            type="hidden"
                                            name="categoryName"
                                            value={categories.find(c => c.id == product.categoryId)?.name || ''}
                                        />
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Images */}
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Ảnh chính</strong></Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailUpload}
                                ref={thumbnailInputRef}
                                required={!product.thumbnail} // Chỉ required khi chưa có ảnh
                            />
                            {thumbnailPreview && (
                                <div className="mt-2 position-relative" style={{ display: 'inline-block' }}>
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail preview"
                                        style={{
                                            maxWidth: '200px',
                                            maxHeight: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="position-absolute top-0 end-0"
                                        style={{ transform: 'translate(30%, -30%)' }}
                                        onClick={handleRemoveThumbnail}
                                    >
                                        ×
                                    </Button>
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Bộ ảnh</strong></Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleGalleryImagesUpload}
                                className="mb-2"
                            />

                            {/* Hiển thị gallery previews */}
                            {galleryPreviews.length > 0 && (
                                <div className="mt-2">
                                    <h6>Ảnh xem trước:</h6>
                                    <Row className="g-2">
                                        {galleryPreviews.map((preview, index) => (
                                            <Col xs={4} md={3} key={index}>
                                                <div className="position-relative">
                                                    <img
                                                        src={preview}
                                                        alt={`Gallery preview ${index + 1}`}
                                                        style={{
                                                            width: '100%',
                                                            height: '120px',
                                                            objectFit: 'cover',
                                                            borderRadius: '8px',
                                                            border: '1px solid #dee2e6'
                                                        }}
                                                    />
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="position-absolute top-0 end-0"
                                                        style={{ transform: 'translate(30%, -30%)' }}
                                                        onClick={() => handleRemoveGalleryImage(index)}
                                                    >
                                                        ×
                                                    </Button>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}
                        </Form.Group>

                        {/* Checkboxes */}
                        <Row className="mb-4">
                            <Col md={6}>
                                <Form.Check
                                    type="checkbox"
                                    label="Sản phẩm nổi bật"
                                    name="isFeatured"
                                    checked={product.isFeatured}
                                    onChange={handleChange}
                                    className="mb-2"
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="Sản phẩm được hiển thị"
                                    name="isActive"
                                    checked={product.isActive}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>

                        {/* Submit Button */}
                        <div className="d-flex justify-content-end gap-2">
                            <Button
                                variant="secondary"
                                size="lg"
                                style={{ minWidth: '150px' }}
                                onClick={resetForm}
                                type="button"
                            >
                                Hoàn tác
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                size="lg"
                                style={{ minWidth: '150px' }}
                            >
                                Thêm sản phẩm
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AddNewProduct;