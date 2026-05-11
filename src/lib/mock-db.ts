import fs from 'fs';
import path from 'path';
import { Organization } from '@/db/schema/organizations';

const MOCK_DB_PATH = path.join(process.cwd(), 'mock-db.json');

export type JoinRequest = {
    id: string;
    organizationId: string;
    studentName: string;
    studentPhone: string;
    studentEmail: string | null;
    message: string | null;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
};

export type MockStudent = {
    id: string;
    organizationId: string;
    name: string;
    phone: string;
    email: string | null;
    admissionDate: string;
    status: 'active' | 'inactive';
};

function ensureMockDb() {
    if (!fs.existsSync(MOCK_DB_PATH)) {
        fs.writeFileSync(MOCK_DB_PATH, JSON.stringify({ organizations: [], joinRequests: [], students: [] }, null, 2));
    }
}

export async function getMockOrganizations() {
    ensureMockDb();
    const data = fs.readFileSync(MOCK_DB_PATH, 'utf8');
    const db = JSON.parse(data);
    return (db.organizations || []) as Organization[];
}

export async function addMockOrganization(org: Omit<Organization, 'id' | 'createdAt'>) {
    ensureMockDb();
    const data = fs.readFileSync(MOCK_DB_PATH, 'utf8');
    const db = JSON.parse(data);
    const newOrg: Organization = {
        ...org,
        id: Math.random().toString(36).substring(2, 11),
        createdAt: new Date()
    };
    db.organizations = db.organizations || [];
    db.organizations.push(newOrg);
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(db, null, 2));
    return newOrg;
}

export async function getMockJoinRequests(organizationId?: string) {
    ensureMockDb();
    const data = fs.readFileSync(MOCK_DB_PATH, 'utf8');
    const db = JSON.parse(data);
    const requests = (db.joinRequests || []) as JoinRequest[];
    if (organizationId) {
        return requests.filter(req => req.organizationId === organizationId);
    }
    return requests;
}

export async function addMockJoinRequest(request: Omit<JoinRequest, 'id' | 'createdAt' | 'status'>) {
    ensureMockDb();
    const data = fs.readFileSync(MOCK_DB_PATH, 'utf8');
    const db = JSON.parse(data);
    const newRequest: JoinRequest = {
        ...request,
        id: Math.random().toString(36).substring(2, 11),
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    db.joinRequests = db.joinRequests || [];
    db.joinRequests.push(newRequest);
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(db, null, 2));
    return newRequest;
}

export async function updateMockJoinRequest(id: string, status: 'approved' | 'rejected') {
    ensureMockDb();
    const data = fs.readFileSync(MOCK_DB_PATH, 'utf8');
    const db = JSON.parse(data);
    const requests = (db.joinRequests || []) as JoinRequest[];
    const index = requests.findIndex(req => req.id === id);
    if (index !== -1) {
        requests[index].status = status;
        db.joinRequests = requests;
        fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(db, null, 2));
        return requests[index];
    }
    return null;
}

export async function getMockStudents(organizationId?: string) {
    ensureMockDb();
    const data = fs.readFileSync(MOCK_DB_PATH, 'utf8');
    const db = JSON.parse(data);
    const students = (db.students || []) as MockStudent[];
    if (organizationId) {
        return students.filter(s => s.organizationId === organizationId);
    }
    return students;
}

export async function addMockStudent(student: Omit<MockStudent, 'id' | 'admissionDate' | 'status'>) {
    ensureMockDb();
    const data = fs.readFileSync(MOCK_DB_PATH, 'utf8');
    const db = JSON.parse(data);
    const newStudent: MockStudent = {
        ...student,
        id: Math.random().toString(36).substring(2, 11),
        status: 'active',
        admissionDate: new Date().toISOString().split('T')[0]
    };
    db.students = db.students || [];
    db.students.push(newStudent);
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(db, null, 2));
    return newStudent;
}
