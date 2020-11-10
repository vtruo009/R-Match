import React, { useReducer, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      width: 400,
      margin: `${theme.spacing(0)} auto`
    },
    loginBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1
    },
    header: {
      textAlign: 'center',
      background: '#212121',
      color: '#fff'
    },
    card: {
      marginTop: theme.spacing(10)
    }
  })
);

//state type

type State = {
  title: string
  department :  string
  hoursPerWeek: string
  major: string
  standing: string
  courses: string
  expiration: string
  description: string
  isButtonDisabled: boolean
  helperText: string
  isError: boolean
};

const initialState:State = {
  title: '',
  department: '',
  hoursPerWeek: '',
  major: '',
  standing: '',
  courses: '',
  expiration: '',
  description: '',
  isButtonDisabled: true,
  helperText: '',
  isError: false
};

type Action = { type: 'setTitle', payload: string }
  | { type: 'setDepartment', payload: string }
  | { type: 'setHoursPerWeek', payload:string}
  | { type: 'setMajor', payload: string}
  | { type: 'setStanding', payload: string}
  | { type: 'setCourses', payload: string}
  | { type: 'setExpiration', payload: string}
  | { type: 'setDescription', payload: string}
  | { type: 'setIsButtonDisabled', payload: boolean }
  | { type: 'loginSuccess', payload: string }
  | { type: 'loginFailed', payload: string }
  | { type: 'setIsError', payload: boolean };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setTitle': 
      return {
        ...state,
        title: action.payload
      };
    case 'setDepartment': 
      return {
        ...state,
        department: action.payload
      };
      case 'setHoursPerWeek': 
      return {
        ...state,
        hoursPerWeek: action.payload
      };
      case 'setMajor': 
      return {
        ...state,
        major: action.payload
      };
      case 'setStanding': 
      return {
        ...state,
        standing: action.payload
      };
      case 'setCourses': 
      return {
        ...state,
        courses: action.payload
      };
      case 'setExpiration':
      return {
        ...state,
        courses: action.payload
      }
      case 'setDescription': 
      return {
        ...state,
        description: action.payload
      };
    case 'setIsButtonDisabled': 
      return {
        ...state,
        isButtonDisabled: action.payload
      };
    case 'loginSuccess': 
      return {
        ...state,
        helperText: action.payload,
        isError: false
      };
    case 'loginFailed': 
      return {
        ...state,
        helperText: action.payload,
        isError: true
      };
    case 'setIsError': 
      return {
        ...state,
        isError: action.payload
      };
  }
}

const JobForm = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.title.trim() && state.department.trim()) {
     dispatch({
       type: 'setIsButtonDisabled',
       payload: false
     });
    } else {
      dispatch({
        type: 'setIsButtonDisabled',
        payload: true
      });
    }
  }, [state.title, state.department]);

   const handleSubmit = () => {
    if (state.title === 'title' && state.department === 'department' && state.hoursPerWeek ==='hoursPerWeek'
    ) {
      dispatch({
        type: 'loginSuccess',
        payload: 'The Job Post Form was sucessfully submitted!'
      });
    } else {
      dispatch({
        type: 'loginFailed',
        payload: 'Please fill out all sections of the form!'
      });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.keyCode === 13 || event.which === 13) {
      state.isButtonDisabled || handleSubmit();
    }
  };

  const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setTitle',
        payload: event.target.value
      });
    };

    const handleHoursPerWeekChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setHoursPerWeek',
        payload: event.target.value
      });
    };

  const handleDepartmentChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setDepartment',
        payload: event.target.value
      });
    }
  return (
    <form className={classes.container} noValidate autoComplete="off">
      <Card className={classes.card}>
        <CardHeader className={classes.header} title="Create A Job Post" />
        <CardContent>
          <div>
            <TextField
              error={state.isError}
              fullWidth
              id="title"
              type="title"
              label="Title"
              placeholder="Title"
              margin="normal"
              onChange={handleTitleChange}
              onKeyPress={handleKeyPress}
            />
            <TextField
              error={state.isError}
              fullWidth
              id="department"
              type="deparment"
              label="Department"
              placeholder="Department"
              margin="normal"
              helperText={state.helperText}
              onChange={handleDepartmentChange}
              onKeyPress={handleKeyPress}
            />
            <TextField
              error={state.isError}
              fullWidth
              id="HoursPerWeek"
              type="HoursPerWeek"
              label="Hours Per Week"
              placeholder="Hours Per Week (Enter a numerical value)"
              margin="normal"
              onChange={handleHoursPerWeekChange}
              onKeyPress={handleKeyPress}
            />
          <TextField
              error={state.isError}
              fullWidth
              id="Major"
              type="Major"
              label="Major"
              placeholder="Major"
              margin="normal"
              //onChange={handleMajorChange}
              onKeyPress={handleKeyPress}
            />
            <TextField
              error={state.isError}
              fullWidth
              id="Standing"
              type="Standing"
              label="Standing"
              placeholder="Standing"
              margin="normal"
              //onChange={handleHoursPerWeekChange}
              onKeyPress={handleKeyPress}
            />
            <TextField
              error={state.isError}
              fullWidth
              id="Courses"
              type="Courses"
              label="Courses"
              placeholder="Courses"
              margin="normal"
              //onChange={handleHoursPerWeekChange}
              onKeyPress={handleKeyPress}
            />
            <TextField
              error={state.isError}
              fullWidth
              id="Expiration"
              type="Expiration"
              label="Expiration"
              placeholder="Expiration"
              margin="normal"
              //onChange={handleHoursPerWeekChange}
              onKeyPress={handleKeyPress}
            />
            <TextField
              error={state.isError}
              fullWidth
              id="Description"
              type="Description"
              label="Description"
              placeholder="Description"
              margin="normal"
              //onChange={handleHoursPerWeekChange}
              onKeyPress={handleKeyPress}
            />
          </div>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            className={classes.loginBtn}
            onClick={handleSubmit}
            disabled={state.isButtonDisabled}>
            Post!
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}

export default JobForm;