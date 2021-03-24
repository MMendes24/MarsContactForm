import React, { useState } from "react"

// for styling and jsx
import { Grid, TextField, Button, Dialog, Typography, DialogTitle } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles"
import SendIcon from '@material-ui/icons/Send';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import CheckIcon from "@material-ui/icons/Check";

// for AWS
import Amplify, { API } from "aws-amplify"
import awsExports from "../aws-exports"
Amplify.configure(awsExports)

const initialValues = {
    name: "",
    email: "",
    message: "",
}

const initialErrValues = {
    nameErr: "",
    emailErr: "",
    messageErr: "",
}

const useStyles = makeStyles(theme => ({
    bigGrid: {
        height: "80vh"
    },
}))


const Form = () => {
    // state goes at top of component
    const [formValues, setForm] = useState(initialValues)
    const [errorValues, setErrors] = useState(initialErrValues)
    const [sent, setSent] = useState(false);

    // for use with material-ui
    const classes = useStyles();

    // for dealing with changes to form state
    const handleChange = e => {
        const { name, value } = e.target;
        setForm({
            ...formValues,
            [name]: value
        })
        let legit
        switch (name) {
            case "email":
                legit = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/).test(value); // common email checking Regex
                if (!legit) {
                    setErrors({ ...errorValues, emailError: "Email must be legit" });
                } else {
                    setErrors({ ...errorValues, emailError: "" });
                }
                break
            case "name":
                legit = new RegExp(/^([a-zA-Z ]){2,30}$/).test(value); // checks for special characters
                if (!legit) {
                    setErrors({ ...errorValues, nameError: "Alphabetical characters only" });
                } else {
                    setErrors({ ...errorValues, nameError: "" });
                }
                break
            case "message":
                if (value.length < 8) {
                    setErrors({ ...errorValues, messageError: "Minimum of 8 characters" });
                } else {
                    setErrors({ ...errorValues, messageError: "" });
                }
                break
            default:
                break;
        }
    };

    // for handling form submission
    const submitForm = e => {
        const data = {
            body: {
                name: formValues.name,
                email: formValues.email,
                message: formValues.message,
            }
        }
        e.preventDefault()
        API.post("formapi2", "/contact", data)
        setForm(initialValues)
        setSent(true)
    }

    const handleClear = e => {
        e.preventDefault()
        setForm(initialValues)
    }

    return (
        <Grid className={classes.bigGrid} container justify="center" direction="column" alignItems="center">
            <Typography variant="h2" gutterBottom>Contact Mars</Typography>
            <form onSubmit={submitForm} noValidate autoComplete="off">
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    spacing={4}
                >
                    <Grid item>
                        <TextField
                            className={classes.input}
                            error={!!errorValues.nameError}
                            helperText={errorValues.nameError}
                            value={formValues.name}
                            onChange={handleChange}
                            autoFocus
                            variant="outlined"
                            id="name"
                            name="name"
                            label="Name"
                            required
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            error={!!errorValues.emailError}
                            helperText={errorValues.emailError}
                            value={formValues.email}
                            onChange={handleChange}
                            variant="outlined"
                            type="email"
                            id="email"
                            name="email"
                            label="Email"
                            required
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            error={!!errorValues.messageError}
                            helperText={errorValues.messageError}
                            value={formValues.message}
                            onChange={handleChange}
                            multiline
                            rowsMin={4}
                            rowsMax={8}
                            aria-label="clear textarea"
                            variant="outlined"
                            id="message"
                            placeholder="Message"
                            name="message"
                            label="Message"
                            required
                        />
                    </Grid>
                </Grid>
                <Grid container justify="center" alignItems="center" spacing={3}>
                    <Grid item>
                        <Button
                            className={classes.button}
                            disabled={
                                formValues.name.length === 0 ||
                                formValues.email.length === 0 ||
                                formValues.message.length === 0 ||
                                errorValues.nameError.length !== 0 ||
                                errorValues.emailError.length !== 0 ||
                                errorValues.messageError.length !== 0
                            }
                            type="submit"
                            color="primary"
                            size="small"
                            variant="outlined"
                            startIcon={<SendIcon />}
                        >Send</Button>
                    </Grid>
                    <Grid item>
                        <Button
                            className={classes.button}
                            disabled={
                                formValues.name.length === 0 &&
                                formValues.email.length === 0 &&
                                formValues.message.length === 0
                            }
                            onClick={handleClear}
                            color="secondary"
                            size="small"
                            variant="contained"
                            startIcon={<DeleteOutlineIcon />}
                        > Clear</Button>
                    </Grid>
                    <Dialog
                        open={sent}
                        onClose={() => {
                            setSent(false);
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="email sent confirmation">
                        <DialogTitle id="alert-dialog-title">{"Message Sent"}<CheckIcon /></DialogTitle>
                    </Dialog>
                </Grid>
            </form>
        </Grid>
    )
}

export default Form