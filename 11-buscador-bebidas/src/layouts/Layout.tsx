import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import Modal from "../components/Modal";
import { useEffect } from "react";
import { useAppStore } from "../stores/useAppStore";
import Notification from "../components/Notification";

export const Layout = () => {
  const loadFromStorage = useAppStore((state) => state.loadFromStorage);
  useEffect(() => {
    loadFromStorage();
  }, []);

  return (
    <>
      <Header />
      <main className="container mx-auto mt-10">
        <Outlet />
      </main>
      <Modal />
      <Notification />
    </>
  );
};
