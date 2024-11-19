var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
const useStyles = makeStyles({
    avatar: {
        height: 32,
        width: 32,
        borderRadius: '50%',
    },
});
export const DenseTable = ({ users }) => {
    const classes = useStyles();
    const columns = [
        { title: 'Avatar', field: 'avatar' },
        { title: 'Name', field: 'name' },
        { title: 'Email', field: 'email' },
        { title: 'Nationality', field: 'nationality' },
    ];
    const data = users.map(user => {
        return {
            avatar: (React.createElement("img", { src: user.picture.medium, className: classes.avatar, alt: user.name.first })),
            name: `${user.name.first} ${user.name.last}`,
            email: user.email,
            nationality: user.nat,
        };
    });
    return (React.createElement(Table, { title: "Example User List (fetching data from randomuser.me)", options: { search: false, paging: false }, columns: columns, data: data }));
};
export const ExampleFetchComponent = () => {
    const { value, loading, error } = useAsync(() => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch('https://randomuser.me/api/?results=20');
        const data = yield response.json();
        return data.results;
    }), []);
    if (loading) {
        return React.createElement(Progress, null);
    }
    else if (error) {
        return React.createElement(Alert, { severity: "error" }, error.message);
    }
    return React.createElement(DenseTable, { users: value || [] });
};
