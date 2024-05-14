// frontend/src/components/Home/AddLocationModal.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	DialogActions,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { usePlaces } from "../../contextAPI/PlacesContext";
import { useToggleManagement } from "../../contextAPI/ToggleManagementContext";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

const AddLocationModal = ({ open, handleClose, username }) => {
	const navigate = useNavigate();
	const { showAlert } = useToggleManagement();
	const { addPlace } = usePlaces();
	const [formData, setFormData] = useState({
		name: "",
		location: "",
		description: "",
		featuredIn: "",
		genre: "",
		image: null,
	});
	const [filePreview, setFilePreview] = useState(null);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file && file.size > MAX_FILE_SIZE) {
			showAlert("error", "이미지 파일은 3MB 이하여야 합니다.");
			e.target.value = null;
		} else {
			setFormData({ ...formData, image: file });
			setFilePreview(URL.createObjectURL(file));
		}
	};

	const validateForm = () => {
		for (const key in formData) {
			if (formData[key] === "" && key !== "image") {
				showAlert("warning", "입력하지 않은 항목이 있습니다.");
				return false;
			}
		}
		if (!formData.image) {
			showAlert("warning", "이미지 파일을 업로드해주세요.");
			return false;
		}
		return true;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		const locationData = new FormData();
		Object.keys(formData).forEach((key) => {
			locationData.append(key, formData[key]);
		});
		locationData.append("addedBy", username);

		try {
			await addPlace(locationData);
			handleClose();
			navigate("/");
			setFormData({
				name: "",
				location: "",
				description: "",
				featuredIn: "",
				genre: "",
				image: null,
			});
			setFilePreview(null);
		} catch (error) {
			console.error("Failed to add location:", error);
		}
	};

	return (
		<>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>장소 추가</DialogTitle>
				<DialogContent>
					{filePreview && (
						<Box sx={{ mb: 2, textAlign: "center" }}>
							<img
								src={filePreview}
								alt="Preview"
								style={{ maxWidth: "100%", maxHeight: "200px" }}
							/>
						</Box>
					)}
					<TextField
						autoFocus
						margin="dense"
						name="name"
						label="제목"
						type="text"
						fullWidth
						variant="outlined"
						value={formData.name}
						onChange={handleChange}
						required
					/>
					<TextField
						margin="dense"
						name="location"
						label="위치 (주소)"
						type="text"
						fullWidth
						variant="outlined"
						value={formData.location}
						onChange={handleChange}
						required
					/>
					<TextField
						margin="dense"
						name="description"
						label="장면 설명"
						fullWidth
						variant="outlined"
						multiline
						rows={4}
						value={formData.description}
						onChange={handleChange}
						required
					/>
					<TextField
						margin="dense"
						name="featuredIn"
						label="출연 작품 (미디어의 제목)"
						fullWidth
						variant="outlined"
						value={formData.featuredIn}
						onChange={handleChange}
						required
					/>
					<FormControl fullWidth sx={{ mt: 2 }}>
						<InputLabel id="genre-select-label">장르</InputLabel>
						<Select
							labelId="genre-select-label"
							id="genre"
							name="genre"
							value={formData.genre}
							label="Genre"
							onChange={handleChange}
							required
						>
							<MenuItem value="Movie">영화</MenuItem>
							<MenuItem value="Drama">드라마</MenuItem>
							<MenuItem value="Anime">애니메이션</MenuItem>
							<MenuItem value="TV Show">TV 프로그램</MenuItem>
						</Select>
					</FormControl>
					<Box mt={2}>
						<Button
							variant="contained"
							component="label"
							startIcon={<PhotoCamera />}
							sx={{
								backgroundColor: "primary.main",
								"&:hover": { backgroundColor: "primary.dark" },
							}}
						>
							이미지 업로드
							<input
								type="file"
								hidden
								accept="image/*"
								onChange={handleFileChange}
							/>
						</Button>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>취소하기</Button>
					<Button onClick={handleSubmit}>추가하기</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default AddLocationModal;
