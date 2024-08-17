import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Tooltip,
	IconButton,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { calculateAge } from "../../utils/form";

// PatientRow Component
const PatientRow = ({ row, isExpanded, handleRowClick, onEdit, onDelete }) => {
	const { HN, prefix, name, surname, gender, DOB, lastUpdate } = row;
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [patientToDelete, setPatientToDelete] = useState(null);

	const isHNPresent = !!HN;

	// Handle opening the delete confirmation dialog
	const handleDeleteClick = (e) => {
		e.stopPropagation();
		setPatientToDelete(HN);
		setDialogOpen(true);
	};

	// Confirm deletion
	const confirmDelete = () => {
		onDelete(patientToDelete);
		setDialogOpen(false);
	};

	return (
		<>
			<TableRow onClick={() => handleRowClick(HN)}>
				<TableCell>{HN || ""}</TableCell>
				<TableCell>{prefix || ""}</TableCell>
				<TableCell>{name || ""}</TableCell>
				<TableCell>{surname || ""}</TableCell>
				<TableCell>{gender || ""}</TableCell>
				<TableCell>{DOB ? calculateAge(DOB) : ""}</TableCell>
				<TableCell>{lastUpdate || ""}</TableCell>
				<TableCell>
					<Tooltip title="Edit Patient">
						<IconButton
							onClick={(e) => {
								e.stopPropagation();
								onEdit(row);
							}}
							color="primary"
							disabled={!isHNPresent}
						>
							<EditIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Delete Patient">
						<IconButton
							onClick={handleDeleteClick}
							color="error"
							disabled={!isHNPresent}
						>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</TableCell>
			</TableRow>
			{isExpanded && (
				<TableRow>
					<TableCell colSpan={8}>
						<div className="sub-row">
							<Table size="small">
								<TableHead>
									<TableRow>
										<TableCell>Timestamp</TableCell>
										<TableCell>Detail</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{/* Replace with actual record data */}
									<TableRow>
										<TableCell>Sample Timestamp</TableCell>
										<TableCell>Sample Detail</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
					</TableCell>
				</TableRow>
			)}

			{/* Confirmation Dialog */}
			<Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
				<DialogTitle>Confirm Deletion</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete the patient with HN: {HN}?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialogOpen(false)}>Cancel</Button>
					<Button variant="contained" color="error" onClick={confirmDelete}>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default PatientRow;