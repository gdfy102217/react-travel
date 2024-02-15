import React, { useState, useEffect } from "react";
import styles from './Header.module.css';
import logo from '../../assets/logo.svg';
import { Button, Dropdown, Input, Layout, Menu, Typography } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { useSelector } from "../../redux/hooks";
import { useDispatch } from "react-redux";
import { changeLanguageActionCreator, addLanguageActionCreator } from "../../redux/language/languageActions";
import { useTranslation } from "react-i18next";
import jwtDecode, {JwtPayload as DefaultJwtPayload} from "jwt-decode";
import { UserSlice } from "../../redux/user/slice";

interface JwtPayload extends DefaultJwtPayload {
  username: string
}

export const Header: React.FC = () => {
  const language = useSelector((state) => state.language.language);
  const languageList = useSelector((state) => state.language.languageList);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const jwt = useSelector(s => s.user.token);
  const [username, setUsername] = useState("")

  const shoppingCartItems = useSelector(s => s.shoppingCart.items)
  const shoppingCartLoading = useSelector(s => s.shoppingCart.loading)

  useEffect(() => {
    if (jwt) {
      const token = jwtDecode<JwtPayload>(jwt)
      if (!token.username) {
        setUsername("user")
      } else {
        setUsername(token.username)
      }
    }
  }, [jwt])

  const onLogout = () => {
    dispatch(UserSlice.actions.logOut());
    navigate("/");
  }

  const menuClickHandler = (e) => {
    console.log(e);
    if (e.key === "new") {
      // 处理新语言添加action
      dispatch(addLanguageActionCreator("new_lang", "新语言"));
    } else {
      dispatch(changeLanguageActionCreator(e.key));
    }
  };

  return (
  <div className={styles['app-header']}>
    <div className={styles['top-header']}>
        <div className={styles.inner} >
        <Typography.Text>{t("header.slogan")}</Typography.Text>
        <Dropdown.Button
              style={{ marginLeft: 15 }}
              overlay={
                <Menu
                  onClick={menuClickHandler}
                  items={[
                    ...languageList.map((l) => {
                      return { key: l.code, label: l.name };
                    }),
                    { key: "new", label: t("header.add_new_language") },
                  ]}
                />
              }
              icon={<GlobalOutlined />}
            >
              {language === "zh" ? "中文" : "English"}
            </Dropdown.Button>
        {jwt ? 
          <Button.Group className={styles['button-group']}>
            <span>{t("header.welcome")}
              <Typography.Text strong>{username}</Typography.Text>
            </span>
            <Button 
              loading={shoppingCartLoading}
              onClick={() => navigate("/shoppingCart")}
            >
              {t("header.shoppingCart")}({shoppingCartItems.length})
              </Button>
            <Button onClick={onLogout}>{t("header.signOut")}</Button>
          </Button.Group>
        :
        <Button.Group className={styles['button-group']}>
          <Button onClick={() => navigate("/register")}>{t("header.register")}</Button>
          <Button onClick={() => navigate("/signin")}>{t("header.signin")}</Button>
        </Button.Group>
        }
        </div>
    </div>
    <Layout.Header className={styles['main-header']}>
        <span onClick={() => navigate("/")}>
            <img src={logo} alt="" className={styles['App-logo']} />
            <Typography.Title className={styles.title} level={3}>{t("header.title")}</Typography.Title>
        </span>
        <Input.Search 
        placeholder={"请输入"}
        className={styles['search-input']}
        onSearch={(keyword) => navigate("/search/" + keyword)}
        />
    </Layout.Header>
    <Menu
        mode={"horizontal"}
        className={styles["main-menu"]}
        items={[
            { key: "1", label: t("header.home_page") },
            { key: "2", label: t("header.weekend") },
            { key: "3", label: t("header.group") },
            { key: "4", label: t("header.backpack") },
            { key: "5", label: t("header.private") },
            { key: "6", label: t("header.cruise") },
            { key: "7", label: t("header.hotel") },
            { key: "8", label: t("header.local") },
            { key: "9", label: t("header.theme") },
            { key: "10", label: t("header.custom") },
            { key: "11", label: t("header.study") },
            { key: "12", label: t("header.visa") },
            { key: "13", label: t("header.enterprise") },
            { key: "14", label: t("header.high_end") },
            { key: "15", label: t("header.outdoor") },
            { key: "16", label: t("header.insurance") },
        ]}
    />
    </div>
  );
}