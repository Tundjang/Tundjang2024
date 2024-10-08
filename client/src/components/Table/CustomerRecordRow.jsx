import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Tooltip,
	IconButton,
	CircularProgress,
	Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PatientRecordPopup from "./PatientRecordPopup";
import { usePatientRecords } from "../../context/patientRecordContext";
import { useSelectedItem } from "../../context/mainContentContext";
import DeleteConfirmationDialog from "../Dialog/DeleteConfirmationDialog";
import { formatDateToThai } from "../../utils/helper";

const PatientRecordRow = ({ patient }) => {
	const [isPopupOpen, setPopupOpen] = useState(false);
	const [patientRecord, setPatientRecord] = useState({
		id: "",
		RR: "",
		extra_food: "",
		notes: "",
		HR: "",
		breath_pattern: "",
		food_type: "",
		extra_symptoms: "",
		eat_method: "",
		BP: "",
		sleep: "",
		BT: "",
		O2sat: "",
		excretion: "",
		food_intake: [],
		conscious: "",
		timestamp: "",
	});
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [recordToDelete, setRecordToDelete] = useState({
		HN: patient.HN,
		docId: null,
	});
	const { useFetchRecords, setCurrentEditRecord, deleteRecord } =
		usePatientRecords();

	const { setSelectedSidebarItem } = useSelectedItem();

	const handleNewClick = (e, docId) => {
		e.stopPropagation();
		setCurrentEditRecord((prev) => ({
			HN: patient.HN,
			docId: { id: "create-new", label: "Create New Record" },
		}));
		setSelectedSidebarItem("Form");
	};

	const handleDeleteClick = (e, docId) => {
		e.stopPropagation();
		setRecordToDelete((prev) => ({ HN: prev.HN, docId: docId }));
		setDialogOpen(true);
	};

	const handleEditClick = (e, HN, docId) => {
		e.stopPropagation();
		setCurrentEditRecord({ HN: HN, docId: { id: docId, label: docId } });
		setSelectedSidebarItem("Form");
	};

	const confirmDelete = () => {
		deleteRecord(recordToDelete);
		setDialogOpen(false);
	};

	const openPopup = () => setPopupOpen(true);
	const closePopup = () => setPopupOpen(false);

	// Fetch records for the given patient HN
	const PatientRecordsDisplay = () => {
		const {
			data: records = [],
			isLoading,
			isError,
		} = useFetchRecords(patient.HN);

		if (isLoading) return <CircularProgress />;
		if (isError) return <div>Error loading records</div>;

		// Sort records by timestamp in descending order (latest first)
		const sortedRecords = records.slice().sort((a, b) => {
			return new Date(b.create_time) - new Date(a.create_time);
		});

		return sortedRecords.map((entry) => (
			<TableRow
				key={entry.id}
				onClick={() => {
					setPatientRecord(entry);
					openPopup();
				}}
			>
				<TableCell>{formatDateToThai(entry.create_time)}</TableCell>
				<TableCell>{entry.notes}</TableCell>
				<TableCell>
					<Tooltip title="Edit Patient">
						<IconButton
							onClick={(e) => {
								handleEditClick(e, patient.HN, entry.id);
							}}
							color="primary"
						>
							<EditIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Delete Patient">
						<IconButton
							onClick={(e) => {
								handleDeleteClick(e, entry.id);
							}}
							color="error"
						>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</TableCell>
			</TableRow>
		));
	};

	return (
		<>
			<TableRow>
				<TableCell colSpan={8}>
					<div className="sub-row">
						<Table size="small">
							<TableHead>
								<TableRow>
									<TableCell>Time</TableCell>
									<TableCell>Detail</TableCell>
									<TableCell>
										<Button onClick={handleNewClick}>Add New Record</Button>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<PatientRecordsDisplay />
							</TableBody>
						</Table>
					</div>
				</TableCell>
			</TableRow>

			<PatientRecordPopup
				open={isPopupOpen}
				onClose={closePopup}
				patient={patient}
				record={patientRecord}
			/>
			<DeleteConfirmationDialog
				isOpen={isDialogOpen}
				onClose={() => setDialogOpen(false)}
				onConfirm={confirmDelete}
				title="Confirm Deletion"
				contentText={`Are you sure you want to delete the record with id: ${recordToDelete.docId}?`}
			/>
		</>
	);
};

export default PatientRecordRow;
