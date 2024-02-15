import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Spin, Row, Col, DatePicker, Space, Divider, Typography, Anchor, Menu, Button } from "antd";
import styles from "./DetailPage.module.css";
import { Header, Footer, ProductIntro, ProductComments } from "../../components";
import { commentMockData } from "./mockup"
import { getProductDetail } from "../../redux/productDetail/slice";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import { MainLayout } from "../../layouts/mainLayout";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { addShoppingCartItem } from "../../redux/shoppingCart/slice";

const { RangePicker } = DatePicker;

type matchParams = {
  touristRouteId: string,
  other: string
}

export const DetailPage: React.FC = (props) => {
  var { touristRouteId } = useParams<matchParams>();
  const loading = useSelector(state => state.productDetail.loading);
  const error = useSelector(state => state.productDetail.error);
  const product = useSelector(state => state.productDetail.data);

  const dispatch = useAppDispatch();

  const jwt = useSelector(s => s.user.token) as string
  const shoppingCartLoading = useSelector(s => s.shoppingCart.loading)

  useEffect(() => {
    if (touristRouteId) {
      dispatch(getProductDetail(touristRouteId))
    }
  }, [])

  if (loading) {
    return (
      <Spin
        size="large"
        style={{
          marginTop: 200,
          marginBottom: 200,
          marginLeft: "auto",
          marginRight: "auto",
          width: "100%",
        }}
      />
    );
  }
  if (error) {
    return <div>网站出错：{error}</div>;
  }
  return <>
    <MainLayout>
      <div className={styles["product-intro-container"]}></div>
      <Row>
        <Col span={13}>
          <ProductIntro
            title={product.title}
            shortDescription={product.description}
            price={product.originalPrice}
            coupons={product.coupons}
            points={product.points}
            discount={product.price}
            rating={product.rating}
            pictures={product.touristRoutePictures.map((p) => p.url)}
          />
        </Col>
        <Col span={11}>
          <Button 
            style={{marginTop: 50, marginBottom: 50, display: "block"}}
            type="primary"
            danger
            loading={shoppingCartLoading}
            onClick={() => {
              dispatch(addShoppingCartItem({jwt, touristRouteId: product.id}))
            }}
          >
            <ShoppingCartOutlined />
            放入购物车
          </Button>
          <RangePicker open style={{ marginTop: 20 }} />
        </Col>
      </Row>
      <Anchor className={styles["product-detail-anchor"]}>
          <Menu mode="horizontal">
            <Menu.Item key="1">
              <Anchor.Link href="#feature" title="产品特色"></Anchor.Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Anchor.Link href="#fees" title="费用"></Anchor.Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Anchor.Link href="#notes" title="预订须知"></Anchor.Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Anchor.Link href="#comments" title="用户评价"></Anchor.Link>
            </Menu.Item>
          </Menu>
        </Anchor>
      <div id="feature" className={styles["product-detail-container"]}>
        <Divider orientation="center">
          <Typography.Title level={3}>产品特色</Typography.Title>
        </Divider>
        <div dangerouslySetInnerHTML={{ __html: product.features }} style={{ margin: 50 }} />
      </div>
      <div id="fees" className={styles["product-detail-container"]}>
        <Divider orientation="center">
          <Typography.Title level={3}>费用</Typography.Title>
        </Divider>
        <div dangerouslySetInnerHTML={{ __html: product.fees }} style={{ margin: 50 }} />
      </div>
      <div id="notes" className={styles["product-detail-container"]}>
        <Divider orientation="center">
          <Typography.Title level={3}>预订须知</Typography.Title>
        </Divider>
        <div dangerouslySetInnerHTML={{ __html: product.notes }} style={{ margin: 50 }} />
      </div>
      <div id="comments" className={styles["product-detail-container"]}>
        <Divider orientation="center">
          <Typography.Title level={3}>用户评价</Typography.Title>
          <div style={{ margin: 40 }}>
            <ProductComments data={commentMockData} />
          </div>
        </Divider>
      </div>

    </MainLayout>
  </>
}