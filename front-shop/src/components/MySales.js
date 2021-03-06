import React, { useState, useEffect } from "react";
import axios from "axios";
import { ListGroup, Container, Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import placeholder from "../assets/images/placeholder2.jpg";
import { Link } from "react-router-dom";
import EmptyCheck from "./EmptyCheck";
import { setDate, setMoney } from "./Convenient";
import { CategoryDirection } from "./CategoryBanner";
import Modal from "./Modal";

function MySales({ history }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContents, setModalContents] = useState("");
    const closeModal = () => {
        setModalOpen(false);
    };

    const [flag, setFlag] = useState(true);
    const [products, setProducts] = useState([]);
    const { isLoggedIn, userData } = useSelector((state) => ({
        isLoggedIn: state.user.isLoggedIn,
        userData: state.user.payload,
    }));

    const fetchOrders = async () => {
        const res = await axios.get("/apis/v1/product/user/" + userData.user_id);
        let product_list = res.data.payload.filter((p) => p.valid === true);
        product_list = product_list.map((product, index) => {
            let path = "/mysales/" + product.pk;
            return (
                <ListGroup.Item key={index}>
                    <Row style={{ padding: 30 }}>
                        <Col sm={{ span: 6, offset: 0 }} lg={{ span: 5, offset: 0 }} xs="12">
                            <Link style={{ textDecoration: "none", color: "inherit" }} key={index} to={path}>
                                <img style={{ maxWidth: "100%", height: "auto" }} src={product.base64_image_url ? product.base64_image_url : placeholder}></img>
                            </Link>
                        </Col>

                        <Col sm="6" lg={{ span: 5, offset: 1 }} xs="12">
                            <div style={{ paddingTop: 10 }}>
                                <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{product.name}</p>
                                <p style={{ fontSize: "1.3rem" }}>??? ??????: {product.quantity}</p>
                                <p style={{ fontSize: "1.2rem" }}>??????: {setMoney(product.price)} ???</p>
                                <p style={{ fontSize: "1.2rem" }}>?????? ??????: {setDate(product.created_at)}</p>
                                <Link style={{ textDecoration: "none", color: "inherit" }} key={index} to={path}>
                                    <p style={{ fontSize: "1.3rem", color: "green" }}>????????? ????????? ????????? ??????????????????!</p>
                                </Link>
                                <Button variant="outline-light" style={{ fontSize: "1rem", background: "#e85255", fontSize: "1.3rem" }} onClick={(e) => onDeleteProduct(product.pk, e)}>
                                    ?????? ?????? ??????
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </ListGroup.Item>
            );
        });
        setProducts(product_list);
    };

    const onDeleteProduct = async (product_id, e) => {
        setModalOpen(true);
        setModalContents("?????? ????????? ???????????????");
        axios
            .delete(`/apis/v1/product/${product_id}`)
            .then((res) => {
                setFlag(!flag);
            })
            .catch((e) => {
                setModalOpen(true);
                setModalContents("????????? ??????????????????. ??????????????? ???????????????.");
            });
    };

    useEffect(() => {
        fetchOrders();
    }, [userData.user_id, flag]);

    return (
        <div>
            <Modal open={modalOpen} close={closeModal}>
                {modalContents}
            </Modal>

            <Container>
                <CategoryDirection tag1={"??? ?????? ??????"}></CategoryDirection>
                <Row>
                    <Col lg={{ span: 10, offset: 1 }}>
                        <EmptyCheck text={"????????? ????????? ????????????"} items={products}></EmptyCheck>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default MySales;
