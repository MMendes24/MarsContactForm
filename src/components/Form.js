import React, { useState } from "react"

// for styling and jsx
import { Grid, TextField, Button, Dialog, DialogContent, Typography, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import CheckIcon from '@material-ui/icons/Check';

// for AWS
import Amplify, { API } from 'aws-amplify'
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
        height: '80vh'
    }
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
        let valid;
        switch (name) {
            case 'email':
                valid = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/).test(value);
                if (!valid) {
                    setErrors({ ...errorValues, emailError: 'Email must be a valid email address' });
                } else {
                    setErrors({ ...errorValues, emailError: '' });
                }
                break;
            case 'name':
                valid = new RegExp(/^[A-Za-z]+$/).test(value);
                if (!valid) {
                    setErrors({ ...errorValues, nameError: 'Name can only consist of alphabetic characters' });
                } else {
                    setErrors({ ...errorValues, nameError: '' });
                }
                break;
            case 'message':
                if (value.length < 8) {
                    setErrors({ ...errorValues, messageError: 'Minimum of 8 characters' });
                } else {
                    setErrors({ ...errorValues, messageError: '' });
                }
                break;
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


    return (
        <Grid className={classes.bigGrid}container justify='center' direction="column" alignItems="center">
            <Typography variant="h3" gutterBottom>Contact MK Decision</Typography>
            <form onSubmit={submitForm} noValidate autoComplete='off'>
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    spacing={4}
                >
                    <Grid item>
                        <TextField
                            variant='outlined'
                            value={formValues.name}
                            onChange={handleChange}
                            required
                            autoFocus
                            id='name'
                            name='name'
                            label='Name'
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            variant='outlined'
                            value={formValues.email}
                            onChange={handleChange}
                            required
                            type='email'
                            id='email'
                            name='email'
                            label='Email'
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            variant='outlined'
                            id='message'
                            multiline
                            value={formValues.message}
                            onChange={handleChange}
                            rowsMax={8}
                            aria-label='clear textarea'
                            placeholder='Message'
                            name='message'
                        />
                    </Grid>
                </Grid>
                <Grid container justify='center' alignItems='center' spacing={3}>
                    <Grid item>
                        <Button
                            disabled={
                                formValues.name.length === 0 ||
                                formValues.email.length === 0 ||
                                errorValues.nameError.length !== 0 ||
                                errorValues.emailError.length !== 0 ||
                                errorValues.messageError.length !== 0
                            }
                            type="submit"
                            color="primary"
                            variant="contained"
                            size="large"
                        > Send</Button>
                    </Grid>
                    <Dialog
                        open={sent}
                        onClose={() => {
                            setSent(false);
                        }}
                        aria-labelledby='alert-dialog-title'
                        aria-describedby='email sent confirmation'>
                        <DialogTitle id='alert-dialog-title'>{'Message Sent'}<CheckIcon/></DialogTitle>
                    </Dialog>
                </Grid>
            </form>
        </Grid>
    )
}

export default Form