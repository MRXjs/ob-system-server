import { Member } from './types';

export const getMemberValues = (member: Member) => [
    member.member_id,
    member.full_name,
    member.year_of_joing_school,
    member.year_of_out_school,
    member.facebook_name,
    member.phone_number,
    member.address,
    member.job_position,
    member.job,
    member.dob,
    member.gender,
    member.civil_status,
    member.whatsapp_number,
];
