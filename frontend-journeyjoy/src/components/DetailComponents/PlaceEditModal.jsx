// PlaceEditModal.jsx 예시
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";
import api from "../../baseAPI/Api";

const PlaceEditModal = ({ open, handleClose, place, refreshPlace }) => {
  const [formData, setFormData] = useState({
    name: place.name,
    location: place.location,
    description: place.description,
    genre: place.genre.join(", "), // 장르 배열을 문자열로 변환
    image: null,
  });

  useEffect(() => {
    // 모달이 열릴 때마다 현재 장소 정보로 폼 데이터 초기화
    setFormData({
      name: place.name,
      location: place.location,
      description: place.description,
      genre: place.genre.join(", "),
      image: null,
    });
  }, [place, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async () => {
    const updateData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] != null) updateData.append(key, formData[key]);
    });

    try {
      await api.put(`/places/${place._id}`, updateData);
      handleClose();
      refreshPlace(); // 상세 페이지 정보 새로고침
    } catch (error) {
      console.error("장소 수정 실패:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>장소 수정</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="이름"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={handleChange}
        />
        {/* 나머지 필드 추가 */}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <Button onClick={handleSubmit}>수정 완료</Button>
      </DialogContent>
    </Dialog>
  );
};

export default PlaceEditModal;
